# Jubilee Learning Hub client

Next.js workspace for the QR-powered training and attendance platform.

## Local development

Use the same-origin backend proxy in `.env.local`:

```env
NEXT_PUBLIC_API_URL=/backend
API_PROXY_TARGET=http://127.0.0.1:8000
```

Then start the client:

```bash
pnpm install
pnpm dev
```

The authentication source of truth is the API's secure cookie session. Browser storage only caches the signed-in user's display details; every page load validates the session with the backend.

The training workflow is API-backed:

- administrators assign programmes to trainers;
- trainers share a public QR/link using the programme's public code;
- any eligible role can join with a name and unique participant code;
- the signed registration receipt marks attendance without requiring an account;
- trainers and administrators download filtered `.xlsx` attendance registers from the backend.

## Verification

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

## Vercel

Keep `NEXT_PUBLIC_API_URL=/backend` and set the server-only `API_PROXY_TARGET` to the public HTTPS backend origin. Requests remain same-origin in the browser, so secure authentication cookies work reliably. The backend production cookie and trusted-host settings still need to match the deployed domains.
