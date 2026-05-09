# Along Cities Frontend

Frontend for Along Cities, a rental-first mobility platform backed by the Along microservices gateway.

## Current Product Scope

- Vehicle rental is the active production flow.
- Rental supports `WITH_DRIVER` and `SELF_DRIVE` modes.
- Ride-hailing, scheduled ride-hailing, and logistics remain visible as coming soon and do not call inactive backend flows.
- All API traffic goes through `NEXT_PUBLIC_BACKEND_URL`, which should point to the gateway.

## Requirements

- Node.js 20+
- npm
- Running Along backend gateway and services
- Stripe publishable key
- Radar publishable key for address autocomplete/maps

## Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required variables:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_BASE_FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_PLATFORM=web-platform
NEXT_PUBLIC_RADAR_API_KEY=your_radar_publishable_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_STRIPE_PK_KEY=pk_test_replace_me
NEXT_PUBLIC_ENABLE_RIDE_HAILING=false
PORT=3001
```

Do not commit `.env`.

## Run Locally

```bash
npm install
npm run dev
```

The app defaults to [http://localhost:3001](http://localhost:3001) when `PORT=3001`.

## Verification

```bash
npm run lint
npm run build
```

## Key Flows

- Sign up: `/onboarding`
- Sign in: `/sign-in`
- Rider dashboard: `/rider-db`
- Driver dashboard: `/driver-db`
- Admin sign in: `/admin-sign-in`
- Admin dashboard: `/admin`
- Rental booking: `/rent-ride`
- Vehicle details: `/rent-ride/vehicle-details`
- Rental payment return: `/rent-ride/success`
- Rider rental lifecycle: `/rider-db/rentals`
- Rider license review: `/rider-db/license`
- Rider rental messages: `/rider-db/messages`
- Driver rental bookings: `/driver-db/rentals`
- Driver vehicle management: `/driver-db/vehicle`
- Driver rental messages: `/driver-db/messages`

## Backend Alignment

The frontend API client:

- sends credentials for cookie auth
- sends the `platform` header so web/mobile cookie auth works through the gateway
- sends `Idempotency-Key` for critical rental commands
- normalizes backend error payloads for UI rendering
- clears stale legacy local tokens on `401`

Uploads use signed direct Cloudinary uploads:

- frontend requests an upload signature from `/user/api/v1/user/upload`
- backend signs `{ folder, timestamp }` only and never receives multipart files
- frontend uploads the media directly to Cloudinary
- only the resulting secure Cloudinary URL is sent back in KYC, license, profile, or vehicle payloads

Rental booking sends:

- `bookingType`: `SELF_DRIVE` or `WITH_DRIVER`
- pickup coordinates/address
- pickup time and requested end time
- duration
- idempotency key

Self-drive bookings are blocked in the UI until the rider has an approved license status from the backend. Driver rental availability and vehicle listing/delisting are sent to the backend services and rely on backend KYC/eligibility enforcement.

Payment confirmation is not trusted from the browser. Stripe Elements confirms the payment client-side, then the backend finalizes payment state from Stripe webhooks.

## Notes

- `docs/frontend-audit-route-map.md` tracks route/API mapping and known deferred work.
- Existing UI components and folder structure are preserved.
- Ride-hailing stores intentionally return a coming-soon notification instead of calling removed/unsupported endpoints.
