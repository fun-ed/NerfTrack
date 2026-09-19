# Repository Guidelines

## Project Overview

NerfTrack is a local-first Tauri 2 desktop app that turns local Codex JSONL usage into local usage, quota, diagnostics, and API-equivalent cost views. Preserve its privacy model: the app must not store or display prompts, raw JSONL, credentials, raw account identifiers, or complete local paths.

## Architecture & Data Flow

- **Frontend:** React renders typed DTOs and coordinates refresh/UI state in `src/App.tsx`.
- **Boundary:** UI code calls typed wrappers in `src/lib/commands.ts`; `src/lib/tauri.ts` invokes native commands only in Tauri and returns sanitized fixtures in browser mode.
- **Backend:** Tauri commands in `src-tauri/src/lib.rs` orchestrate:
  `discovery.rs` → `collector.rs` → `parser.rs` → `storage.rs` / `estimator.rs` → DTOs → React.
- **Persistence:** `storage.rs` owns migrations, checkpointed imports, local SQLite projections, and transactional rebuilds. The production database belongs in platform-native app-data, never the repository or current directory.
- **Background work:** startup pricing/reconciliation must run in Rust background workers; status commands/UI rendering must remain responsive.
- **Pricing:** `pricing.rs` refreshes the public models.dev OpenAI catalog. Use validated cached/embedded pricing when unavailable; manual local overrides win.

Keep frontend types in `src/domain.ts` aligned with Rust serialized DTOs in `src-tauri/src/models.rs`. Maintain the thin command boundary rather than reaching into native behavior from components.

## Key Directories

- `src/` — React application, domain DTOs, i18n, styles, colocated frontend tests.
- `src/components/` — presentation and interaction components; `UsageChart.tsx` presents already-derived history rather than implementing persistence/estimation.
- `src/lib/` — Tauri command wrappers, browser-mode fixture fallback, chart/comparison helpers, updater integration.
- `src/test/` — Vitest setup.
- `src-tauri/src/` — Rust application logic, native commands, data pipeline, and colocated unit tests.
- `src-tauri/capabilities/` — Tauri permission capabilities.
- `docs/` — architecture, development, calculation, privacy, troubleshooting, and release references.
- `script/` — platform helpers; `script/build_and_run.sh` is a macOS install/debug helper.

## Development Commands

Use the committed npm lockfile:

```bash
npm ci
npm run dev                 # Vite browser preview with sanitized fixture data
npm run tauri:dev           # Native app and real local discovery path
npm run format:check
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

Native checks:

```bash
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets --all-features -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
npm run tauri:build         # Native bundle; run for packaging/integration changes
```

Run `git diff --check` before handing off a change. For focused work, run the relevant Vitest/Cargo test first, then the applicable gates above.

## Code Conventions & Common Patterns

- **TypeScript:** strict compiler settings; function components and React Hooks. Use types from `src/domain.ts` and typed wrapper functions such as `getHistory(range)` rather than ad hoc invoke calls.
- **Formatting:** Prettier uses semicolons, single quotes, trailing commas, and a 100-character print width. ESLint uses recommended JS/TypeScript plus React Hooks/Refresh rules; explicit `any` is intentionally allowed.
- **UI state:** `App.tsx` owns cross-view lifecycle, refresh, errors, and cached results; views own local form/draft state. Preserve optimistic-update rollback where an action can fail.
- **Native state/errors:** Rust keeps `AppState` shared through `Arc<Mutex<_>>`; command boundaries return `Result<_, String>`. Use typed DTOs and redacted user-facing diagnostics rather than leaking filesystem or raw-record data.
- **Parsing/estimation:** parser state is scoped to a rollout/session. Fast mode requires explicit `thread_settings_applied` evidence; do not infer it from timing, configuration, provider, or authentication signals. Invalid estimation intervals stay pending/rejected rather than becoming fabricated zeroes.
- **Filesystem:** use platform-aware `Path` APIs. Preserve safe traversal, canonical-directory tracking, recursive-link rejection, byte/parser checkpoints, and partial-final-line handling.
- **Dependencies:** add them only with a clear need and compatible license; assess network, telemetry, sync, and privacy effects. Keep manifests and lockfiles in sync.

## Important Files

- `src/main.tsx` — React entry point.
- `src/App.tsx` — application orchestration and view routing.
- `src/domain.ts` — frontend-native DTO contract.
- `src/lib/commands.ts` and `src/lib/tauri.ts` — typed native boundary and browser fallback.
- `src/lib/fixtures.ts` — sanitized deterministic browser/test data.
- `src/i18n.tsx` — typed English, Simplified Chinese, and Traditional Chinese catalogue/context.
- `src-tauri/src/lib.rs` — Tauri composition root, application state, background lifecycle, command registration.
- `src-tauri/src/{discovery,collector,parser,storage,pricing,estimator,models}.rs` — core data pipeline and contracts.
- `docs/ARCHITECTURE.md` and `docs/CALCULATION.md` — behavioral invariants for pipeline and estimator work.
- `src-tauri/tauri.conf.json` — Vite/Tauri dev and build integration.
- `.github/workflows/ci.yml` — current CI quality and packaging authority.

## Runtime/Tooling Preferences

- Use **npm** (`package-lock.json` v3); CI uses Node 22. Do not substitute Bun/Yarn/pnpm.
- Frontend: React 19, TypeScript 5.8, Vite 7. Vite development runs on `localhost:1420` with `strictPort: true`; only `VITE_` and `TAURI_` environment variables are exposed to frontend code.
- Backend: Rust edition 2021, minimum 1.77.2; CI uses stable Rust with rustfmt and Clippy.
- Treat `package.json`, `src-tauri/Cargo.toml`, and active CI workflow scripts as authoritative for current commands and supported build behavior.

## Testing & QA

- Frontend tests use Vitest + jsdom + Testing Library. Tests are colocated under `src/` as `*.test.ts(x)` (the config also accepts `*.spec.ts(x)`), for example `src/App.test.tsx` and `src/components/UsageChart.test.tsx`.
- Use accessible queries and realistic events: `screen.getByRole(...)`, `userEvent.setup()`, and `vi.fn()`/`vi.spyOn()` for boundaries. Use complete local helper builders with `Partial<T>` overrides for scenario data.
- Rust tests are colocated in `#[cfg(test)] mod tests` within the relevant `src-tauri/src/*.rs` module.
- Use deterministic, local, sanitized fixtures. Never use the host's Codex installation, private records, credentials, full local paths, generated databases, or audit snapshots.
- Behavior changes require regression coverage when practical. For parser, discovery, storage, collector, or estimator changes, add a focused test that exercises the changed transition with synthetic data.
