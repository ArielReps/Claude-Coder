#!/usr/bin/env node
/**
 * uninstall-claude-standards.mjs
 *
 * Removes the company coding standards installed by setup-claude-standards.mjs.
 * It deletes from ~/.claude/rules/ only the company-*.md files that exist in
 * this repo (i.e. the ones the installer copied), and leaves your own
 * CLAUDE.md and any other rules untouched. Honors CLAUDE_CONFIG_DIR.
 *
 * Usage (run from anywhere; keep it beside the company-*.md files):
 *   node uninstall-claude-standards.mjs
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sourceDir = path.dirname(fileURLToPath(import.meta.url));
const configDir =
    process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
const rulesDir = path.join(configDir, "rules");

const removeRuleFiles = () => {
    const ruleFileNames = fs
        .readdirSync(sourceDir)
        .filter((name) => /^company-.*\.md$/.test(name));
    return ruleFileNames.filter((name) => {
        const target = path.join(rulesDir, name);
        const exists = fs.existsSync(target);
        if (exists) fs.rmSync(target);
        return exists;
    });
};

const removeRulesDirIfEmpty = () => {
    const isEmpty =
        fs.existsSync(rulesDir) && fs.readdirSync(rulesDir).length === 0;
    if (isEmpty) fs.rmdirSync(rulesDir);
    return isEmpty;
};

const main = () => {
    if (!fs.existsSync(rulesDir)) {
        console.log("\nNothing to remove: " + rulesDir + " does not exist.\n");
        return;
    }
    const removedFileNames = removeRuleFiles();
    console.log("\nCompany Claude Code standards removed.\n");
    console.log("Rules directory: " + rulesDir + "\n");
    if (removedFileNames.length === 0) {
        console.log("  (no company-*.md files from this repo were present)");
    } else {
        removedFileNames.forEach((name) => console.log("  - " + name));
    }
    if (removeRulesDirIfEmpty()) {
        console.log("\nRemoved the now-empty rules directory.");
    }
    console.log(
        "\nDone. Restart Claude Code so it no longer loads these rules." +
            "\nYour own CLAUDE.md and any other rules were left untouched.\n"
    );
};

try {
    main();
} catch (error) {
    console.error("Uninstall failed: " + error.message);
    process.exit(1);
}
