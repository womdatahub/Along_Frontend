# Frontend Audit + Route Mapping

Date: 2026-05-08
Project: Along Cities frontend (`../along`)
Backend source: Along Services gateway + route audit

## Implemented

- Central API client uses the gateway base URL, cookie credentials, platform headers, normalized errors, response normalization, and idempotency headers.
- Auth flow supports email or phone login through gateway cookie auth.
- Driver onboarding now captures vehicle class and rental modes (`WITH_DRIVER`, `SELF_DRIVE`).
- Rental discovery sends vehicle class, coordinates, and booking type.
- Rental booking sends pickup window, requested end time, booking type, duration, and idempotency key.
- Stripe checkout returns to `/rent-ride/success` and the success screen clearly treats browser confirmation as pending backend webhook confirmation.
- Rider and driver dashboards show backend rental activity where available.
- Rider rental details support cancellation.
- Driver rental details support begin/finalize lifecycle actions.
- Driver dashboard includes a pickup-location based “List for rental” control.
- Vehicle details now include gallery, owner/driver, specs, pricing, mode, and booking continuation.
- Self-drive checkout is gated behind approved rider license status.
- Rider license submission is available from dashboard/profile and uploads review images directly to Cloudinary using a backend-signed upload payload.
- Rider/driver rental list pages show active/history lifecycle entries.
- Rider/driver rental detail pages can open backend rental conversations.
- Driver dashboard supports vehicle delisting and driver availability updates.
- Non-existent ride-hailing API helpers were removed from callable API paths.
- Ride-hailing stores now show coming-soon messaging instead of calling removed services.
- README and `.env.example` were updated for local setup.

## Route Status

| Route | Status |
| --- | --- |
| `/` | Public landing; preserved |
| `/about` | Public; preserved |
| `/privacy-policy` | Public; preserved |
| `/terms-of-service` | Public; preserved |
| `/onboarding` | User account registration |
| `/onboarding/otp` | Email verification |
| `/onboarding/account` | Rider/driver role selection |
| `/onboarding/rider` | Rider profile onboarding |
| `/onboarding/driver-info` | Driver profile onboarding |
| `/onboarding/services` | Rental service selection; ride/logistics disabled |
| `/onboarding/documents` | Driver KYC/license upload |
| `/onboarding/vehicle-info` | Vehicle registration and rental-mode selection |
| `/sign-in` | Email/phone login |
| `/rent-ride` | Active rental discovery, request, checkout |
| `/rent-ride/vehicle-details` | Active vehicle gallery/details/pricing |
| `/rent-ride/success` | Payment return state |
| `/rent-ride/succss` | Backward-compatible redirect to success route |
| `/rider` | Rider dashboard with rental activity |
| `/rider/rentals` | Rider active/history rentals |
| `/rider/ride-details` | Rental details/cancel |
| `/rider/license` | Rider license upload/review state |
| `/rider/messages` | Rental conversation list/detail |
| `/driver` | Driver/owner dashboard with listing and rental activity |
| `/driver/rentals` | Driver/owner rental bookings |
| `/driver/vehicle` | Driver vehicle profile/manage delisting |
| `/driver/ride-details` | Rental details/begin/finalize |
| `/driver/messages` | Rental conversation list/detail |
| `/ride` | Visible but inactive coming-soon ride-hailing |
| `/schedule-ride` | Visible but inactive coming-soon scheduled ride-hailing |
| `/admin/*` | Existing admin coverage preserved; selected route mismatch fixed |

## Backend Gateway Helpers

| Helper | Gateway base |
| --- | --- |
| `userApiStr` | `/user/api/v1` |
| `rentalApiStr` | `/rental/api/v1` |
| `paymentApiStr` | `/payment/api/v1` |
| `adminApiStr` | `/admin/api/v1` |
| `communicationApiStr` | `/communication/api/v1` |
| `locationApiStr` | `/location/api/v1` |
| `mapApiStr` | `/map/api/v1` |
| `tripHistoryApiStr` | `/trip-history/api/v1` |
| `notificationApiStr` | `/notify/api/v1` |

## Deferred Work

- Notification polling/websocket UI once notification realtime contract is exposed.
- Admin rental operations screens beyond the existing admin dashboard/users/compliance/marketplace coverage.
- More targeted tests for auth, rental booking, payment return, and lifecycle controls.
