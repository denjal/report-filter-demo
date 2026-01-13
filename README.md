# Report Filter Demo (HR Absence + Permission Scopes)

React + TypeScript + Vite demo app for:
- Linear-style filter UX
- Permission-scoped “branches” (OR between scopes)
- Light/Dark mode toggle

## Local development

```bash
npm install
npm run dev
```

## Deploy (Vercel)

This is a static Vite app:
- **Build command**: `npm run build`
- **Output directory**: `dist`

`vercel.json` is included for SPA-friendly rewrites to `index.html`.

### Deploy via Vercel UI (recommended)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel: **New Project → Import repo**.
3. If Vercel asks for settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**.

### Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
```

For production:

```bash
vercel --prod
```


