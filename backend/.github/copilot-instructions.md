## Purpose
Short, actionable guidance for AI coding agents working on the backend service of this monorepo.

## Big picture
- Backend is an Express API (entry: `src/index.js`) using Prisma as ORM (`prisma/schema.prisma`).
- Major responsibilities: auth, problems, submissions (Judge0 integration), playlists. See `src/routes/*` and `src/controller/*` for HTTP surface.
- Database client is loaded via `src/libs/db.js` and uses the generated Prisma client in `src/generated/prisma`.

## Key files to read first
- `src/index.js` — server bootstrap and middleware registration.
- `src/routes/*.js` — route wiring to controllers.
- `src/controller/*` — business logic for each API area (auth, problem, playlist, submission, execute code).
- `src/libs/db.js` — exported `db` prisma client used everywhere.
- `src/libs/judge0.lib.js` — Judge0 integration (external code execution service).
- `prisma/schema.prisma` and `prisma/migrations/` — canonical DB schema and migration history.

## Conventions & patterns (project-specific)
- Controllers respond with JSON shape `{ success: boolean, message: string, ... }` for successful flows and `{ error: string }` for errors.
- Auth middleware attaches an authenticated user to `req.user`. Controller functions expect `req.user.id` for user-scoped queries.
- Prisma models are accessed through `db.<modelName>` (e.g., `db.playlist`, `db.problemInPlaylist`). Always check exact field names in `schema.prisma` (some code uses `playListId` vs `playlistId`).
- Routes call controllers directly; controllers handle validation, Prisma calls, and status codes.

## Common developer workflows
- Install deps: `npm install` (run in `backend/`).
- Start dev server with auto-reload: `npm run dev` (nodemon runs `src/index.js`).
- Generate Prisma client: `npx prisma generate`.
- Run migrations (dev): `npx prisma migrate dev --schema=prisma/schema.prisma`.
- Apply migrations (prod): `npx prisma migrate deploy` and then `npx prisma generate`.

## Integration & environment
- The app requires a DATABASE_URL in environment (dotenv is used). Place env vars in `.env` at `backend/` or provide through your environment.
- Judge0 usage: see `src/libs/judge0.lib.js` for HTTP integration patterns (axios). Respect timeouts and handle async job polling.
- Prisma client is checked in under `src/generated/prisma` — CI or developers may regenerate with `npx prisma generate` after schema changes.

## What to watch for (gotchas discovered in code)
- Field-name mismatches: some controller code uses `playListId` while route params use `playlistId`. Validate names against `prisma/schema.prisma` when editing playlist-related logic.
- Error handling pattern: controllers log errors using `console.error(...)` and return 500 with `{ error: '...' }`.

## Examples to copy (quick snippets)
- User-scoped find: `await db.playlist.findMany({ where: { userId: req.user.id }, include: { problems: { include: { problem: true } } } })` — use this pattern for eager-loading relations.
- Bulk create: `db.problemInPlaylist.createMany({ data: problemIds.map(id => ({ playListId: playlistId, problemId: id })) })` — ensure field names match schema.

## When changing DB schema
- Update `prisma/schema.prisma`, create a migration (`npx prisma migrate dev`), then run `npx prisma generate` and restart the dev server.

## If you need to run or debug locally
- Ensure `DATABASE_URL` is set; run `npm run dev` in `backend/`.
- Use `console.log`/`console.error` (existing pattern) for quick debugging; controllers already emit helpful messages on failure.

## Where to ask follow-ups
- Point edits to controllers in `src/controller/*` and route wiring in `src/routes/*`.
- If uncertain about a Prisma model, consult `prisma/schema.prisma` and `src/generated/prisma`.

---
If any area above seems incomplete or you want the file at repository root instead of `backend/.github/`, tell me and I will update accordingly.
