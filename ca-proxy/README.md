# ca-proxy

Cloudflare Worker that fronts the Cactuar Alliance frontend. Bridges between
the React app (cactuaralliance.com) and:

1. The published Google Sheet that lists member FCs (Milestone 5)
2. The FFXIV Lodestone FC pages for live stats (Milestone 6)

Both upstreams are cached in a Workers KV namespace (`CA_CACHE`) to keep
latency low and stay within free-tier limits.

## Endpoints

| Method | Path | Returns |
|--------|------|---------|
| `GET`  | `/`               | Health-check JSON |
| `GET`  | `/fcs`            | `{ fcs: FC[], fetchedAt }` (currently a hardcoded fixture) |
| `GET`  | `/fc/:lodestoneId`| `{ lodestone, fetchedAt }` — **501 until Milestone 6** |

All non-`OPTIONS` requests are gated by an Origin allowlist
(`cactuaralliance.com` + localhost). Disallowed origins receive `403`.

## Local development

```sh
# from the ca-proxy/ directory
npm install
npm run dev    # wrangler dev — listens on http://localhost:8787
```

The React app reads `VITE_PROXY_URL` (defaults to `http://localhost:8787`).
To point the frontend at a deployed Worker, set:

```sh
VITE_PROXY_URL=https://ca-proxy.example.workers.dev npm run dev
```

## Provisioning before first deploy

1. Create the KV namespace and paste the returned `id` into `wrangler.jsonc`:

   ```sh
   npx wrangler kv:namespace create CA_CACHE
   ```

2. Set the Google Sheet `SHEET_ID` (and optionally `SHEET_GID`) in
   `wrangler.jsonc` `vars`. The sheet must be **File → Share → Publish to web**
   so `/spreadsheets/d/<id>/export?format=csv` returns the rows.

3. Deploy:

   ```sh
   npm run deploy
   ```

## Layout

```
ca-proxy/
├── src/
│   ├── index.ts        # router: /, /fcs, /fc/:id
│   ├── http.ts         # CORS + origin allowlist + JSON helpers
│   ├── fixtures.ts     # placeholder FCs (replaced in Milestone 5)
│   ├── sheet.ts        # CSV fetch + parse (Milestone 5)
│   ├── lodestone.ts    # Lodestone FC scraper (Milestone 6)
│   └── types.ts        # wire format — mirror of src/types.ts in frontend
├── wrangler.jsonc      # binding config, observability, vars
├── tsconfig.json
└── package.json
```
