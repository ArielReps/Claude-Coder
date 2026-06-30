#!/usr/bin/env node
/**
 * setup-claude-standards.mjs
 *
 * Installs the company coding standards into Claude Code so every session
 * follows them automatically. Copies the company-*.md rule files that live
 * next to this script into the per-user rules directory (~/.claude/rules/),
 * which Claude Code loads at the start of every session, in every project on
 * this machine.
 *
 * Usage (run from anywhere; keep the .md files beside this script):
 *   node setup-claude-standards.mjs
 *
 * Safe to re-run: it overwrites only the company-*.md files it copies, and
 * never touches your own CLAUDE.md or other rules. Honors CLAUDE_CONFIG_DIR.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const sourceDir = path.dirname(fileURLToPath(import.meta.url));
const configDir =
    process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
const rulesDir = path.join(configDir, "rules");

const copyRuleFiles = () => {
    const ruleFileNames = fs
        .readdirSync(sourceDir)
        .filter((name) => /^company-.*\.md$/.test(name));
    fs.mkdirSync(rulesDir, { recursive: true });
    ruleFileNames.forEach((name) =>
        fs.copyFileSync(path.join(sourceDir, name), path.join(rulesDir, name))
    );
    return ruleFileNames;
};

const printDetectedVersion = () => {
    try {
        const version = execSync("claude --version", {
            stdio: ["ignore", "pipe", "ignore"],
        })
            .toString()
            .trim();
        console.log("\nDetected Claude Code: " + version);
    } catch {
        console.log(
            "\nNote: could not detect the Claude Code version. The rules/ directory" +
                "\nrequires Claude Code v2.0.64 or later (run `claude --version`)."
        );
    }
};

const main = () => {
    const copiedFileNames = copyRuleFiles();
    if (copiedFileNames.length === 0) {
        console.log(
            "No company-*.md files found next to this script. Keep them in the same folder."
        );
        return;
    }
    console.log("\nCompany Claude Code standards installed.\n");
    console.log("Rules written to: " + rulesDir + "\n");
    copiedFileNames.forEach((name) => console.log("  + " + name));
    printDetectedVersion();
    console.log(
        "\nDone. Restart Claude Code and run /memory to confirm the rules are loaded." +
            "\nThe React rules load automatically when you edit .tsx or .css.ts files.\n"
    );
};

try {
    main();
} catch (error) {
    console.error("Setup failed: " + error.message);
    process.exit(1);
}
