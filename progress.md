Original prompt: there is a problem you allow the name of the universe the same ,fix the bug

## Work Log

- Added server-side duplicate universe name validation in `POST /api/universes` (case-insensitive, trimmed).
- Added unique default-name generation (`Universe Ω-N`) so auto-generated names cannot collide after deletions.
- Updated client create flow to throw a readable error when the API returns a non-2xx response.
- Updated universe create UI to show inline creation errors.
- Build verification passed: `npm run build`.
- API validation run:
  - First create request with unique name returned `200`.
  - Immediate duplicate create request returned `409` with message: `Universe name already exists. Choose a different designation.`
- Playwright validation run:
  - Captured UI screenshots from `/tmp/bi_v2_dup_ui_second/shot-0.png`.
  - Inline duplicate-name error text is visible in the create card.
  - Runtime errors artifact includes the expected `409 (Conflict)` failed-resource browser log for the intentional duplicate submission.
- Cleaned up temporary validation data by deleting test universe `abbaab`.
- Stopped temporary Vite server used for validation.

## TODO / Next

- None.
