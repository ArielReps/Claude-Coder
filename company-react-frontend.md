---
paths:
  - "**/*.tsx"
  - "**/*.css.ts"
---

# React / Frontend Requirements

These rules apply to every React frontend. They build on the rules above (functional-first, no hardcoded text, arrow functions only, files < 100 lines, functions < 30 lines). The reference implementation that embodies all of this is `C:\dev\Kolsherut-Application\FE` — when in doubt, mirror it.

## 1. Component Folder Structure

All components **MUST** sit under one of two top-level folders in `src/`:

- **`pages/`** — the structure of every page lives here. Each page gets its own folder (e.g. `pages/homepage/`, `pages/contact/`, `pages/dashboard/`, `pages/pricing/`), and that page's component (and its own sub-components) live inside it.
- **`components/`** — components **shared across pages** (e.g. `navbar`, `footer`, `label`, `controlledModal`). Anything reused by more than one page belongs here.

Rule of thumb: if a component is owned by a single page, it lives under that page's folder in `pages/`; the moment it is shared between pages, it moves to `components/`.

Every component lives in its **own dedicated folder** (camelCase folder name, PascalCase component). The folder contains:

- **A. MUST — `<name>.tsx`**: the component file. It contains **only** the hooks and the JSX (whatever is in the `return`). It must **never** contain logic that can be separated — no business logic, no data transformation, no calculations inline.
- **B. MUST — styling file `<name>.css.ts`**: holds **all** the CSS for that `.tsx` file and nothing else. Default styling platform is **react-jss** (`createUseStyles`, props-parameterized styles supported). When creating a project **from scratch**, ask the user which styling approach they prefer (react-jss / CSS modules / styled-components / etc.) before choosing.
- **C. OPTIONAL — logic file(s) `<name>Logic.ts`**: contains all logic of the component that can be separated from the `.tsx`. There can be several if needed. All pure functions.
- **D. OPTIONAL — sub-components**: nested component folders used **only** by this parent. Prefer extracting sub-components wherever reasonable — favor many small sub-components over one large component.
- **F. OPTIONAL — shared logic**: if several sub-components share logic, place it in the **parent** (e.g. a shared logic file or `utils/`). Sharing flows **downstream only** — the parent may provide logic to its sub-components, but **never** pull logic up from a sub-component into the parent.

Example folder tree:

```
src/
├── pages/                          # one folder per page
│   ├── homepage/
│   │   ├── homepage.tsx            # hooks + JSX only
│   │   ├── homepage.css.ts
│   │   └── heroBanner/            # sub-component used only by homepage (OPTIONAL)
│   │       ├── heroBanner.tsx
│   │       └── heroBanner.css.ts
│   ├── contact/
│   ├── dashboard/
│   └── pricing/
└── components/                     # components shared across pages
    ├── navbar/
    │   ├── navbar.tsx
    │   └── navbar.css.ts
    ├── footer/
    │   ├── footer.tsx
    │   ├── footer.css.ts
    │   └── linksMenu/             # sub-component used only by footer (OPTIONAL)
    │       ├── linksMenu.tsx
    │       └── linksMenu.css.ts
    └── label/
        ├── label.tsx
        ├── label.css.ts
        └── labelLogic.ts          # separated pure logic (OPTIONAL)
```

## 2. App Storage (once per app)

Every project **MUST** have app-wide storage. If no Context or Redux store already wraps the app, create one and wire it ready-to-use. Default is Redux Toolkit:

- `store/store.ts` configures the store from domain reducers.
- Each domain gets its own folder (e.g. `store/general/`) with `<domain>Slice.ts` (`createSlice`), `<domain>.selector.ts` (memoized `createSelector`), and `initialState.ts` (typed).
- The `<Provider store={store}>` wraps the app in `main.tsx`.

This setup is done **only once per application**.

## 3. Services

In `src/` there is a `services` folder (reuse it if it exists; otherwise create it). Every service goes in its **own dedicated folder** (or a single file for a small one).

- **ALL services MUST be functional programming only** — arrow functions, immutable data, no classes.

## 4. Init File

Every project **MUST** have an init file (e.g. `services/initialize.ts`), even if it is not used yet — it exists so there is always a place to do startup work later. Keep it empty/minimal if there is nothing to do yet.

Reference shape: `initialize.ts` default-exports an `async (main) => { ... }` that runs startup (e.g. `await loadConfig()`) and then mounts the app; `main.tsx` builds the React tree and calls `initialize(main)`.

```ts
// services/initialize.ts
export default async (main: React.ReactNode) => {
    await loadConfig();
    // ...other startup hooks go here (keep empty if nothing yet)
    ReactDOM.createRoot(document.getElementById('root')!).render(main);
};
```

## 5. Configuration Files

Every project **MUST** ship at least `config.json` and `strings.json` (under `public/configs/`), pulled on init. There **MUST** be a `loadConfig`-style loader that, at startup:

- fetches both files (and any others — `environment.json`, etc.) with a cache-buster (`?cacheBuster=...`),
- attaches each to a global (`window.config`, `window.strings`, …),
- and `Object.freeze`s them (immutable at runtime).

## 6. Strings From Strings File Only

Every static text shown to the user **MUST** live in `strings.json` and be read from the loaded global (e.g. `window.strings`). Never hardcode display text in `.ts`/`.tsx` files. (Reinforces section 4 of the general rules.)

## 7. Docker

- The `Dockerfile` **MUST** use **nginx** (serve the built `dist` from `/usr/share/nginx/html`, copy the env-specific nginx conf).
- `docker-compose` **MUST** mount the `public/configs` files (`config.json`, `strings.json`, …) as **volumes**, so the FE pulls live configuration on init without rebuilding the image.

## 8. package.json Scripts

`package.json` **MUST** include the full toolchain:

- `dev`, `preview`, `build` (with per-environment variants),
- `docker:build` (a.k.a. build-docker), `docker:save`,
- `tar` — build the image and save it to a `.tar` (per environment).

## 9. nginx Configuration

There **MUST** be at least one nginx config file (a basic one to start), with SPA fallback `try_files $uri $uri/ /index.html`. Add more per-environment configs as needed.
