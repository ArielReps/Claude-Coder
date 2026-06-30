# Claude-coder

Company coding standards for [Claude Code](https://code.claude.com), packaged so every developer's Claude Code follows the same rules automatically — in every project, without pasting anything into chat.

Running the setup script copies the rule files in this repo into your personal Claude Code rules directory (`~/.claude/rules/`). Claude Code loads them at the start of every session.

## What's in here

| File | What it is | When it loads |
| --- | --- | --- |
| `company-code-style.md` | General code-writing rules (files, functions, paradigm, no hardcoded text, imports, complexity). | Every session, every project. |
| `company-llm-and-prompts.md` | Rules for LLM pipeline nodes and editing agent system prompts. | Every session, every project. |
| `company-react-frontend.md` | React / frontend architecture rules (folder structure, store, services, config, Docker, nginx). | Only when you edit `.tsx` or `.css.ts` files. |
| `setup-claude-standards.mjs` | Installer that copies the three rule files into `~/.claude/rules/`. | — |

## Requirements

- [Claude Code](https://code.claude.com) **v2.0.64 or later** (the `rules/` directory feature). Check with `claude --version`.
- Node.js — already installed if you have Claude Code.

## Install

Clone the repo and run the setup script. Keep the `.md` files next to the script (the script copies whatever `company-*.md` files sit beside it).

```bash
git clone <this-repo-url> Claude-coder
cd Claude-coder
node setup-claude-standards.mjs
```

This works the same on Windows, macOS, and Linux. The script never touches your own `CLAUDE.md` or any rules it didn't create.

## Verify it worked

Start (or restart) Claude Code, then run:

```
/memory
```

You should see `company-code-style.md` and `company-llm-and-prompts.md` listed. `company-react-frontend.md` appears once you open a `.tsx` or `.css.ts` file.

## Updating the standards

These are plain markdown files, so updating is easy:

1. Edit the relevant `company-*.md` file and push.
2. Have everyone re-run `node setup-claude-standards.mjs`.

Re-running is safe and overwrites only the files it installs.

## Good to know

- **Path-scoped React rules.** The top of `company-react-frontend.md` has a small `paths:` header so those rules load only for frontend files, keeping them out of backend-only work. To make them load everywhere, delete that header block (the lines between the two `---`).
- **Guidance, not enforcement.** Claude Code treats these rules as context it follows, not a hard gate. For anything that must be enforced no matter what (e.g. blocking a commit), back it with a linter or a Claude Code hook.
- **Custom config location.** If you've relocated your Claude Code config with `CLAUDE_CONFIG_DIR`, the script writes to that location automatically.
