import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { convertToLlm, serializeConversation } from "@earendil-works/pi-coding-agent";
import { uuidv7 } from "@earendil-works/pi-ai";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const skillPath = join(root, "skills", "mori-mode", "SKILL.md");
const agentSkillPath = join(root, "skills", "mori-agent", "SKILL.md");
const MODE = "mori-mode";
const SECTION = "mori_mode";

const instructions = `Mori mode governs every request: follow ${skillPath}. Read it in full once per session, and again after each compaction, before acting. Delegate to the \`mori-agent\` subagent.`;
const rereadReminder = `The conversation was compacted, so the mori-mode skill, the run log and the active playbook are no longer in context. Before acting, read ${skillPath} in full, then the run log in tmp/runs/, then the active playbook.`;

const handoverPrompt = (conversation: string, previousSummary?: string, runLog?: string, focus?: string) => `Write the handover for the lead agent of a mori-mode session. The conversation below is about to leave the lead's context. Your summary replaces it, next to the most recent messages, which stay word for word. The lead must be able to continue without asking the user anything the user already answered.

Use these sections, in this order. Leave a section out only when it has nothing to say.

## Goal
The user's goal in their own words, then in yours.

## Standing grants
Every permission the user gave that outlives one action, such as "merge on lgtm" or "no need to ask again", quoted exactly, with what it covers and any limit the user set.

## Decisions
Each decision, its reason, and who made it: the user or the lead. Include what the user rejected, so the lead does not propose it again.

## In flight
Subagents, branches, worktrees, pull requests and running processes, each with its identifier and state.

## Next
The next steps, in order, each with the check that ends it.

## Critical context
The exact values needed to continue: paths, commands, IDs, URLs, numbers and error messages.

Quote the user wherever their exact words carry the meaning. Write exact identifiers, not descriptions of them.${runLog ? `\n\nThe run log below is the lead's own record. Keep everything in it, except what the conversation shows has changed.\n\n<run-log>\n${runLog}\n</run-log>` : ""}${previousSummary ? `\n\nThe previous handover below covers the conversation before this one. Carry forward everything in it that is still true.\n\n<previous-handover>\n${previousSummary}\n</previous-handover>` : ""}${focus ? `\n\nThe user asked this compaction to focus on: ${focus}` : ""}

The handover is done when a fresh lead, reading only it and the recent messages, would take the same next step and ask the user nothing already answered. Reply with the handover only, in Markdown.

<conversation>
${conversation}
</conversation>`;

const latestRunLog = (cwd: string) => {
  const dir = join(cwd, "tmp", "runs");
  if (!existsSync(dir)) return undefined;
  const newest = readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => ({ path: join(dir, name), mtime: statSync(join(dir, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0];
  return newest && `${newest.path}\n\n${readFileSync(newest.path, "utf8")}`;
};

const list = (value: unknown): string[] => (value instanceof Set || Array.isArray(value) ? [...value].map(String) : []);

const fileLists = (fileOps: Record<string, unknown> | undefined) => {
  const read = list(fileOps?.readFiles ?? fileOps?.read);
  const modified = [...new Set([...list(fileOps?.modifiedFiles), ...list(fileOps?.edited), ...list(fileOps?.written)])];
  return { readFiles: read.filter((path) => !modified.includes(path)), modifiedFiles: modified };
};

type Brief = { agent?: unknown; task?: unknown };

const withSkillPath = (brief: Brief) => {
  if (brief.agent === "mori-agent" && typeof brief.task === "string" && !brief.task.includes(agentSkillPath)) {
    brief.task = `${brief.task}\n\nmori-agent skill: ${agentSkillPath}`;
  }
};

export default function (pi: ExtensionAPI) {
  let on = false;

  const showStatus = (ctx: ExtensionContext) => ctx.ui.setStatus(MODE, on ? "mori" : undefined);

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
    const { preparation, customInstructions, signal } = event;
    const conversation = serializeConversation(convertToLlm([...preparation.messagesToSummarize, ...preparation.turnPrefixMessages]));
    const prompt = handoverPrompt(conversation, preparation.previousSummary, latestRunLog(ctx.cwd), customInstructions);
    try {
      const response = await ctx.modelRegistry.complete(
        ctx.model,
        { messages: [{ role: "user", content: [{ type: "text", text: prompt }], timestamp: Date.now() }] },
        { maxTokens: 8192, signal, cacheRetention: "none", sessionId: uuidv7() },
      );
      const handover = response.content.filter((part) => part.type === "text").map((part) => part.text).join("\n").trim();
      if (!handover) return;
      const files = fileLists(preparation.fileOps as Record<string, unknown> | undefined);
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
      if (!signal.aborted) ctx.ui.notify(`mori compaction failed, using Pi's: ${error instanceof Error ? error.message : error}`, "warning");
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
    const input = event.input as Brief & { args?: { tasks?: unknown } };
    withSkillPath(input);
    if (Array.isArray(input.args?.tasks)) input.args.tasks.forEach((task: Brief) => withSkillPath(task));
  });

  pi.registerCommand("mori-mode", {
    description: "Toggle mori-mode for this session",
    handler: async (_args, ctx) => {
      on = !on;
      pi.appendEntry(MODE, { on });
      showStatus(ctx);
      ctx.ui.notify(`mori-mode ${on ? "on" : "off"}`, "info");
    },
  });
}
