# 7VN Essentials — supplier-ready backend foundation

Architecture: Cloudflare Worker + D1 + replaceable supplier adapter. This is a **scaffold**, not a connected supplier service.

## Setup (not yet deployed)
1. From `backend/`, run `npm install` if adding dependencies, then `npx wrangler d1 create 7vn-essentials-db`.
2. Replace `REPLACE_WITH_D1_DATABASE_ID` in `wrangler.toml` with the returned database ID.
3. Apply schema: `npx wrangler d1 execute 7vn-essentials-db --remote --file=./schema.sql`.
4. Deploy: `npx wrangler deploy`.
5. Verify `/health`, `/api/store-status`, and `/api/catalog` before linking the frontend.

## Security and operations
- Never commit supplier API keys, payment secrets, or webhook signing keys. Use `wrangler secret put`.
- Supplier adapters must normalize SKUs, costs, case quantities, inventory, lead times, and tracking.
- Catalog rows are not sellable until supplier-verified. No stock is assumed.
- Checkout and order submission are hard-disabled in code, regardless of config.
- Before launch: authenticated admin sync, payment provider with verified webhooks, tax/shipping quotes, idempotent order processing, supplier retry/failure handling, tracking callbacks, logging and alerts.
- Do not expose supplier credentials or supplier cost through public API.
- CORS is limited to the configured storefront origin; CORS is not authentication.
- D1 schema is an initial design and may require migrations when a supplier is selected.
