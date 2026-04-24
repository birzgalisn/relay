# Web (Vite + React)

From the repo root:

```bash
pnpm run dev -- --filter=web
```

The dev server listens on [http://localhost:4000](http://localhost:4000) (see `vite.config.ts`), matching Traefik routing from `make up` (`compose.yaml`, profile `dev`).

Edit `src/packages/landing` (feature entry: `feature/Landing.tsx`); the page hot-reloads on save.

The app calls the API at `VITE_API_BASE_URL` when set, otherwise `http://localhost:3000`. See `.env.local.example` at the repo root.

Build:

```bash
pnpm run build -- --filter=web
```

Production static files are emitted to `dist/`. Use `pnpm run start` in this package (or `vite preview`) to serve them locally.
