# Technology stack
- Frontend: React 19 + TypeScript 5.8 (strict) + Vite 7; browser tests use Vitest 3, jsdom, and Testing Library.
- Desktop/backend: Tauri 2 + Rust edition 2021 (minimum Rust 1.77.2); SQLite through bundled rusqlite.
- Package manager is npm with committed `package-lock.json`; CI uses Node 22 and stable Rust with rustfmt/clippy.
- Rust uses serde/serde_json for DTOs, reqwest (blocking/json/stream/rustls) for the bounded models.dev catalog request, and rfd for native file selection.
- Vite development server is fixed to port 1420 (`strictPort: true`).