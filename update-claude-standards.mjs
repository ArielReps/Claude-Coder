#!/usr/bin/env node
/**
 * update-claude-standards.mjs
 *
 * Updates the installed company standards in one step:
 *   1. uninstall the currently installed rules
 *   2. git pull the latest version of this repo
 *   3. install the updated rules
 *
 * Running uninstall before the pull means renamed or removed rule files are
 * cleaned up correctly. If the pull fails (no network, merge conflict, etc.),
 * the current rules are reinstalled so you are never left with none.
 *
 * Run from anywhere inside the cloned repo. Honors CLAUDE_CONFIG_DIR (it is
 * inherited by the install/uninstall steps).
 *
 * Usage:
 *   node update-claude-standards.mjs
 */

import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoDir = path.dirname(fileURLToPath(import.meta.url));

const run = (label, command) => {
    console.log("\n=== " + label + " ===");
    execSync(command, { cwd: repoDir, stdio: "inherit" });
};

const main = () => {
    run("Removing current rules", "node uninstall-claude-standards.mjs");
    try {
        run("Pulling latest from git", "git pull");
    } catch (error) {
        console.error("\ngit pull failed — restoring the current rules.");
        run("Reinstalling current rules", "node setup-claude-standards.mjs");
        throw error;
    }
    run("Installing updated rules", "node setup-claude-standards.mjs");
    console.log("\nUpdate complete. Restart Claude Code to load the updated rules.\n");
};

try {
    main();
} catch (error) {
    console.error("\nUpdate failed: " + error.message);
    process.exit(1);
}
