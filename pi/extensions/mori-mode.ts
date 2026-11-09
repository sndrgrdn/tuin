import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const skillPath = join(root, "skills", "mori-mode", "SKILL.md");
const MODE = "mori-mode";
const SECTION = "mori_mode";

const instructions = `Mori mode governs every request: follow ${skillPath}. Read it in full once per session, and again after each compaction, before acting. Delegate to the \`mori-agent\` subagent.`;
const rereadReminder = `The conversation was compacted, so the mori-mode skill, the run log and the active playbook are no longer in context. Before acting, read ${skillPath} in full, then the run log in tmp/runs/, then the active playbook.`;

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

  pi.on("session_compact", async () => {
    if (on) pi.sendMessage({ customType: MODE, content: rereadReminder, display: false }, { deliverAs: "steer" });
  });

  pi.on("before_agent_start", async (event) => {
    if (on) event.systemPromptOptions.sections[SECTION] = instructions;
    else delete event.systemPromptOptions.sections[SECTION];
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
