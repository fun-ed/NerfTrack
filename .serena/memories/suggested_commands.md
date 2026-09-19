# Suggested commands
- Install exact frontend dependencies: `npm ci`.
- Browser fixture dev server: `npm run dev`; native desktop dev: `npm run tauri:dev`; production native bundle: `npm run tauri:build`.
- Frontend targeted/full checks: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test -- --run`, `npm run build`.
- Native checks: `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`; `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets --all-features -- -D warnings`; `cargo test --manifest-path src-tauri/Cargo.toml`.
- Verify a clean patch: `git diff --check`.