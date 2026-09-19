# NerfTrack core
- Local-first Tauri 2 desktop monitor: React UI invokes typed Rust commands; Rust owns discovery, collection, parsing, SQLite, pricing, and estimation.
- Frontend entry: `src/main.tsx` → `src/App.tsx`; Tauri command wrappers live in `src/lib/commands.ts`, with deterministic browser-mode fixtures via `src/lib/tauri.ts` and `src/lib/fixtures.ts`.
- Native orchestration: `src-tauri/src/lib.rs`; domain modules: `discovery.rs`, `collector.rs`, `parser.rs`, `storage.rs`, `pricing.rs`, `estimator.rs`, `models.rs`, `updater.rs`.
- Privacy invariant: never persist or expose prompts, raw JSONL, raw account IDs, credentials, or complete local paths. Use redacted diagnostics and deterministic/sanitized fixtures.
- Critical behavior/invariants (architecture, refresh lifecycle, discovery precedence, storage): `mem:architecture`. Toolchain and commands: `mem:tech_stack`, `mem:suggested_commands`, `mem:task_completion`. Style and test conventions: `mem:conventions`.