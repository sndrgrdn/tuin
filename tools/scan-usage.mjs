import { createReadStream, readdirSync, statSync } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";

const root = process.argv[2];
if (!root) {
  console.error("usage: node tools/scan-usage.mjs <sessions-dir>");
  process.exit(1);
}

const principles = [
  "Prove It Works", "Laziness Protocol", "Subtract Before You Add", "Fix Root Causes",
  "Test Behavior, Not Implementation", "Never Block on the Human", "Guard the Context Window",
  "Foundational Thinking", "Model the Domain", "Boundary Discipline", "Type System Discipline",
  "Redesign From First Principles", "Exhaust the Design Space", "Minimize Reader Load",
  "Sequence Work into Verifiable Units", "Make Operations Idempotent",
  "Separate Before Serializing Shared State", "Migrate Callers Then Delete Legacy APIs",
  "Outcome-Oriented Execution", "Explain the Number", "Attack the Premise", "Experience First",
  "Build the Lever", "Encode Lessons in Structure",
];

const fileRe = /(?<!upstream\/skills\/)(?<!team-kit\/)(?<![a-z-])(?:tuin-mode|tuin-agent|mori-mode|mori-agent|writing-for-agents|simplify|handoff|prove-it|grill-me|research|deep-research|domain-modeling|show-me|pr-description|code-review|retro|reprompt|how|architect|interrogate|tdd|no-comments|unslop|technical-writing|create-verification|maintain-verification|create-formal-verification|maintain-formal-verification)\/(?:SKILL\.md|principles\/[a-z-]+\.md|playbooks\/[a-z-]+\.md|references\/[a-z-]+\.md)|tmp\/runs\/[^"\s\\]+\.md/g;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name !== "subagent-artifacts") walk(path, acc);
    } else if (name.endsWith(".jsonl")) {
      acc.push(path);
    }
  }
  return acc;
}

const textOf = (content) =>
  Array.isArray(content) ? content.map((c) => c.text ?? c.thinking ?? "").join("\n") : String(content ?? "");

const sessionsWith = {};
const citedIn = {};
let tuinSessions = 0;
let total = 0;

for (const file of walk(root)) {
  total++;
  const touched = new Set();
  const cited = new Set();
  let tuin = false;
  for await (const line of createInterface({ input: createReadStream(file) })) {
    if (!/tuin|mori/.test(line)) {
      if (!tuin) continue;
    }
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    const message = entry.message;
    if (entry.type !== "message" || !message) continue;
    if (message.role === "user" && /(?:tuin|mori)-mode/.test(textOf(message.content))) tuin = true;
    if (message.role !== "assistant" || !Array.isArray(message.content)) continue;
    for (const part of message.content) {
      if (part.type !== "toolCall") continue;
      for (const match of JSON.stringify(part.arguments ?? {}).matchAll(fileRe)) {
        tuin = true;
        touched.add(match[0].startsWith("tmp/runs/") ? "run log" : match[0].replace(/^mori-/, "tuin-"));
      }
    }
    const text = textOf(message.content).toLowerCase();
    for (const name of principles) if (text.includes(name.toLowerCase())) cited.add(name);
  }
  if (!tuin) continue;
  tuinSessions++;
  for (const key of touched) sessionsWith[key] = (sessionsWith[key] ?? 0) + 1;
  for (const key of cited) citedIn[key] = (citedIn[key] ?? 0) + 1;
}

const table = (counts) =>
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, n]) => `${String(n).padStart(5)}  ${key}`)
    .join("\n");

console.log(`${tuinSessions} of ${total} sessions used tuin\n`);
console.log("Files read (sessions):");
console.log(table(sessionsWith) || "  none");
console.log("\nPrinciples named in agent text (sessions):");
console.log(table(citedIn) || "  none");
