# Coder

## 1. Purpose
This file defines the coding style and architectural guidelines for the project. It serves as a reference for all contributors to ensure consistency, maintainability, and readability across the codebase.
## 2. General Instructions:
- **Questions**: If you have any questions about the instructions or need clarification, please ask before writing code or making decisions.
- **Consistency**: Follow the instructions consistently across all files and modules. If you encounter a situation not covered by the instructions, You need to ask me what to do.

# Code Writing Requirements

## 1. Files

- **Single Responsibility**: Every file must be pure — it serves exactly one purpose/target. No mixing concerns.
- **Exception — Utils**: Only utility files may contain multiple exports, but all utilities within a single file must belong to the same scope/domain.
- **Max Length**: A file must never exceed **100 lines** of code. If it does, split it into smaller, focused files.
- **Folder Structure**: Organize files into folders by domain/feature. Each folder should have a clear purpose and contain only related files. I like folders to be as nested as needed to achieve clear organization, but avoid unnecessary nesting that adds complexity. Try to aim to avarage of 3-7 files per folder, but this is not a strict rule — the key is logical organization and single responsibility at the file level.

## 2. Functions

- **Pure Functions**: All functions must be pure — no side effects. Given the same input, they must always return the same output without modifying external state.
- **Error Handling**: Do **not** use `try/catch` inside simple or low-level functions. Let errors propagate up and handle them in the main service/orchestrator that invokes them. Reserve `try/catch` for top-level entry points only.
- **Max Length**: A function must never exceed **30 lines**. Aim for an average of **~20 lines**. If a function grows beyond this, decompose it into smaller helper functions.
- **JS/TS Related ONLY**: Make functions only as arrow functions, don't use var, only const or let

## 3. Paradigm

- **Naming**: All variables, functions files and folders must have informative names, I prefer the names to be long and informative.
- **Functional Programming First**: Default to a functional programming style — plain functions, composition, and immutable data. Avoid classes.
- **OOP Only When Necessary**: Use classes only when there is a clear, justified need (e.g., framework requirements, stateful abstractions that genuinely benefit from encapsulation). If the same result can be achieved with functions, prefer functions.

## 4. No Hardcoded Text or Environment Variables Usage.

- **Never hardcode text** (strings, labels, messages, URLs, keys, etc.) directly in script files — only dedicated variable/config files are allowed.
- **Frontend**: All secrets must be defined in `config.json` and text will be defined in `strings.json`. Script files (`.ts`, `.tsx`) must read values from config, never inline them.
- **Backend**: All secrets must be defined in `vars.py` and text will be defined in `strings.py` (or `vars.ts` for TS-based services), with `.env` variables overriding defaults. Script files (`.py`, `.ts`) must import from the vars file.
- **Exception**: Only `vars.py`, `vars.ts`, and `config.json` may contain literal text values.

## 5. Importing.

- All Imports must be on the top of the file.
- Never use `require` only if you get specific permission from the user. use only `import`

## 6. Complicated Code.

- Try to avoid writing complicated code as much as you can, try to keep everything simple.
- Avoid nested functions and loops as much as possible, when you see that function gets too complicated move it to new file and split it to one main function that calls small clear functions.
