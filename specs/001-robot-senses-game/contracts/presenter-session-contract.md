# Contract: Presenter Session And Security Boundary

## Scope

Defines the protected-session expectations between the browser application and
hosted authentication services.

## Session Rules

- Only authenticated presenter identities may access the `/game` route.
- The browser must verify session presence before rendering protected gameplay
  content.
- Session expiry or explicit sign-out must return the presenter to `/login` and
  clear in-memory game state that depends on authentication.

## Sign-In Contract

### Input

- Presenter-provided credentials accepted by the hosted auth provider.

### Success Output

- Session object with a presenter identity reference.
- Protected route access granted for `/game`.
- Sanitized telemetry event recorded as `login_success`.

### Failure Output

- Presenter remains on `/login`.
- Child-facing UI does not expose raw provider error payloads.
- Sanitized telemetry event recorded as `login_failure`.

## Protected Device Access Contract

- Microphone and camera requests may only occur after an authenticated session
  exists and the presenter explicitly triggers Hear or See.
- Denied or unsupported permissions must not terminate the presenter session.
- No raw media payload may be persisted to hosted storage in this feature.

## Telemetry Contract

- Required security-relevant events:
  - `login_success`
  - `login_failure`
  - `permission_denied`
  - `action_failed`
  - `session_ended`
- Event payloads may include timestamps, action identifiers, and sanitized error
  categories.
- Event payloads may not include secrets, raw auth tokens, raw microphone data,
  or raw camera frames.

## Verification Evidence

- Automated route-guard test for unauthenticated access.
- Automated sign-in success and failure flow coverage.
- Manual review confirming no sensitive tokens or provider internals appear in
  presenter-facing messages.
- Manual review confirming denied permissions leave the session intact.