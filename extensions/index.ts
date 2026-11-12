import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { convertToLlm, serializeConversation } from "@earendil-works/pi-coding-agent";
import { uuidv7 } from "@earendil-works/pi-ai";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillPath = join(root, "skills", "tuin-mode", "SKILL.md");
const agentSkillPath = join(root, "skills", "tuin-agent", "SKILL.md");
const reviewerBriefPath = join(root, "skills", "no-comments", "references", "reviewer-brief.md");
const MODE = "tuin-mode";
const SECTION = "tuin_mode";

const instructions = `Tuin mode governs every request: follow ${skillPath}. Read it in full once per session, and again after each compaction, before acting. Delegate to the \`tuin-agent\` subagent.`;
const rereadReminder = `The conversation was compacted, so the tuin-mode skill and the active playbook are no longer in context. Before acting, read ${skillPath} in full, then the active playbook. The next new piece of work, such as a new PR, is a new task: run Start of every task for it and pick its playbook.`;

const handoverPrompt = (conversation: string, previousSummary?: string, focus?: string) => `Write the handover for the lead agent of a tuin-mode session. The conversation below is about to leave the lead's context. Your summary replaces it, next to the most recent messages, which stay word for word. The lead must be able to continue without asking the user anything the user already answered.

Use these sections, in this order. Leave a section out only when it has nothing to say.

## Goal
The user's goal in their own words, then in yours.

## Standing grants
Every permission the user gave that outlives one action, such as "merge on lgtm" or "no need to ask again", in the user's exact words and at the scope they named. List a grant only with those quoted words; move a grant without them to Decisions as the lead's own proposal, which the user has not granted.

## Decisions
Each decision, its reason, and who made it: the user or the lead. Include what the user rejected, so the lead does not propose it again.

## In flight
Subagents, branches, worktrees, pull requests and running processes, each with its identifier and state.

## Next
The next steps, in order, each with the check that ends it.

## Critical context
The exact values needed to continue: paths, commands, IDs, URLs, numbers and error messages.

Quote the user wherever their exact words carry the meaning. Write exact identifiers, not descriptions of them.

Keep it short: one line per item, and no item the lead can recover from the repository, the recent messages, or a skill, playbook or project rule file; name that file instead. Drop finished work unless it limits what comes next. Drop anything superseded; keep only the current state.${previousSummary ? `\n\nThe previous handover below covers the conversation before this one. Carry forward everything in it that is still true.\n\n<previous-handover>\n${previousSummary}\n</previous-handover>` : ""}${focus ? `\n\nThe user asked this compaction to focus on: ${focus}` : ""}

The handover is done when a fresh lead, reading only it and the recent messages, would take the same next step and ask the user nothing already answered. Reply with the handover only, in Markdown.

<conversation>
${conversation}
</conversation>`;

const list = (value: unknown): string[] => (value instanceof Set || Array.isArray(value) ? [...value].map(String) : []);

const fileLists = (fileOps: Record<string, unknown> | undefined, previous: Record<string, unknown> | undefined) => {
  const modified = [...new Set([...list(previous?.modifiedFiles), ...list(fileOps?.modifiedFiles), ...list(fileOps?.edited), ...list(fileOps?.written)])];
  const read = [...new Set([...list(previous?.readFiles), ...list(fileOps?.readFiles ?? fileOps?.read)])];
  return { readFiles: read.filter((path) => !modified.includes(path)), modifiedFiles: modified };
};

type Brief = { agent?: unknown; task?: unknown; model?: unknown };

const briefPaths: Record<string, string> = {
  "tuin-agent": `tuin-agent skill: ${agentSkillPath}`,
  "comment-reviewer": `comment-reviewer brief: ${reviewerBriefPath}`,
};

const withBriefPath = (brief: Brief) => {
  const path = typeof brief.agent === "string" ? briefPaths[brief.agent] : undefined;
  if (path && typeof brief.task === "string" && !brief.task.includes(path)) brief.task = `${brief.task}\n\n${path}`;
};

const missingModel = (input: Brief & { action?: unknown; workflow?: unknown; args?: { tasks?: unknown } }) => {
  if (input.action || (input.workflow && input.workflow !== "parallel")) return false;
  const tasks = Array.isArray(input.args?.tasks) ? (input.args.tasks as Brief[]) : [input];
  return tasks.some((task) => typeof task.agent === "string" && !task.model && !input.model);
};

export default function (pi: ExtensionAPI) {
  let on = false;

  const showStatus = (ctx: ExtensionContext) => ctx.ui.setStatus(MODE, on ? "tuin" : undefined);

  const restore = (ctx: ExtensionContext) => {
    on = false;
    for (const entry of ctx.sessionManager.getBranch()) {
      if (entry.type === "custom" && entry.customType === MODE) on = Boolean((entry.data as { on?: boolean })?.on);
    }
    showStatus(ctx);
  };

  pi.on("session_start", async (_event, ctx) => restore(ctx));
  pi.on("session_tree", async (_event, ctx) => restore(ctx));

  pi.on("session_before_compact", async (event, ctx) => {
    if (!on || !ctx.model) return;
    const { preparation, branchEntries, customInstructions, signal } = event;
    const previous = branchEntries.filter((entry) => entry.type === "compaction").pop() as { details?: Record<string, unknown> } | undefined;
    const files = fileLists(preparation.fileOps as Record<string, unknown> | undefined, previous?.details);
    const conversation = serializeConversation(convertToLlm([...preparation.messagesToSummarize, ...preparation.turnPrefixMessages]));
    const prompt = handoverPrompt(conversation, preparation.previousSummary, customInstructions);
    try {
      const response = await ctx.modelRegistry.complete(
        ctx.model,
        { messages: [{ role: "user", content: [{ type: "text", text: prompt }], timestamp: Date.now() }] },
        { maxTokens: 8192, signal, cacheRetention: "none", sessionId: uuidv7() },
      );
      const handover = response.content.filter((part) => part.type === "text").map((part) => part.text).join("\n").trim();
      if (!handover) return;
      const tags = [
        files.readFiles.length ? `<read-files>\n${files.readFiles.join("\n")}\n</read-files>` : "",
        files.modifiedFiles.length ? `<modified-files>\n${files.modifiedFiles.join("\n")}\n</modified-files>` : "",
      ].filter(Boolean);
      return {
        compaction: {
          summary: [handover, ...tags].join("\n\n"),
          firstKeptEntryId: preparation.firstKeptEntryId,
          tokensBefore: preparation.tokensBefore,
          usage: response.usage,
          details: files,
        },
      };
    } catch (error) {
      if (!signal.aborted) ctx.ui.notify(`tuin compaction failed, using Pi's: ${error instanceof Error ? error.message : error}`, "warning");
      return;
    }
  });

  pi.on("session_compact", async () => {
    if (on) pi.sendMessage({ customType: MODE, content: rereadReminder, display: false }, { deliverAs: "steer" });
  });

  pi.on("before_agent_start", async (event) => {
    if (on) event.systemPromptOptions.sections[SECTION] = instructions;
    else delete event.systemPromptOptions.sections[SECTION];
  });

  pi.on("tool_call", async (event) => {
    if (event.toolName !== "subagent") return;
    const input = event.input as Brief & { action?: unknown; workflow?: unknown; args?: { tasks?: unknown } };
    if (on && missingModel(input)) {
      return { block: true, reason: `Pass model and effort on every spawn, from the role lines in ${join(root, "skills", "tuin-mode", "models.md")}, such as "anthropic/claude-opus-5-5:high".` };
    }
    withBriefPath(input);
    if (Array.isArray(input.args?.tasks)) input.args.tasks.forEach((task: Brief) => withBriefPath(task));
  });

  pi.registerCommand("tuin-mode", {
    description: "Toggle tuin-mode for this session",
    handler: async (_args, ctx) => {
      on = !on;
      pi.appendEntry(MODE, { on });
      showStatus(ctx);
      ctx.ui.notify(`tuin-mode ${on ? "on" : "off"}`, "info");
    },
  });
}
