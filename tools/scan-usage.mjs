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

const fileRe = /mori-[a-z-]+\/(?:SKILL\.md|principles\/[a-z-]+\.md|playbooks\/[a-z-]+\.md|references\/[a-z-]+\.md)|tmp\/runs\/[^"\s\\]+\.md/g;

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
let moriSessions = 0;
let total = 0;

for (const file of walk(root)) {
  total++;
  const touched = new Set();
  const cited = new Set();
  let mori = false;
  for await (const line of createInterface({ input: createReadStream(file) })) {
    if (!line.includes("mori")) {
      if (!mori) continue;
    }
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    const message = entry.message;
    if (entry.type !== "message" || !message) continue;
    if (message.role === "user" && /mori-mode/.test(textOf(message.content))) mori = true;
    if (message.role !== "assistant" || !Array.isArray(message.content)) continue;
    for (const part of message.content) {
      if (part.type !== "toolCall") continue;
      for (const match of JSON.stringify(part.arguments ?? {}).matchAll(fileRe)) {
        mori = true;
        touched.add(match[0].startsWith("tmp/runs/") ? "run log" : match[0]);
      }
    }
    const text = textOf(message.content).toLowerCase();
    for (const name of principles) if (text.includes(name.toLowerCase())) cited.add(name);
  }
  if (!mori) continue;
  moriSessions++;
  for (const key of touched) sessionsWith[key] = (sessionsWith[key] ?? 0) + 1;
  for (const key of cited) citedIn[key] = (citedIn[key] ?? 0) + 1;
}

const table = (counts) =>
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, n]) => `${String(n).padStart(5)}  ${key}`)
    .join("\n");

console.log(`${moriSessions} of ${total} sessions used mori\n`);
console.log("Files read (sessions):");
console.log(table(sessionsWith) || "  none");
console.log("\nPrinciples named in agent text (sessions):");
console.log(table(citedIn) || "  none");
