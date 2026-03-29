# Contract: Game UI And Interaction States

## Scope

Defines the route-level and action-level behavior the application must expose to
presenters and reviewers.

## Routes

### `/login`

- Purpose: Authenticate the presenter before loading protected content.
- Required UI elements:
  - Sign-in form and submit action.
  - Loading state while authentication is in progress.
  - Plain-language failure state for invalid credentials or service outage.
- Exit condition:
  - On successful authentication, navigate directly to `/game`.

### `/game`

- Purpose: Present the robot experience and action controls.
- Required UI regions:
  - Robot stage containing the Phaser-rendered character.
  - Presenter control panel with labeled actions: Speak, Hear, See, Think, Jump.
  - Live status region that announces action progress and errors.
  - Sign-out or end-session control.
- Access rule:
  - Route is presenter-protected and must redirect unauthenticated users to
    `/login`.

## Action Contract

Each action must implement the following lifecycle contract.

| Action | Input Trigger | Required Precondition | Required Active Feedback | Success Outcome | Failure / Fallback Outcome |
|--------|---------------|-----------------------|--------------------------|----------------|----------------------------|
| Speak | Button click or keyboard activation | Authenticated presenter session | Robot visibly enters speaking state and live status announces speech start | Spoken phrase completes and robot returns to idle | Show readable failure message and keep other actions available |
| Hear | Button click or keyboard activation | Authenticated session and microphone request initiated | Listening indicator and live status announce microphone state within 2s | Recognized phrase is repeated back or shown visually | Permission denial, unsupported browser, or no-speech state is explained with retry or fallback |
| See | Button click or keyboard activation | Authenticated session and camera request initiated | Camera preview or equivalent visible indicator appears within 2s | Robot remains in looking state while preview is active | Permission denial or missing device is explained without blocking the game |
| Think | Button click or keyboard activation | Authenticated session | Robot enters thinking state and prompt is shown or spoken | Child-friendly feedback on answer outcome | Prompt can be retried or skipped without breaking other actions |
| Jump | Button click or keyboard activation | Authenticated session | Immediate visible movement feedback | Jump animation completes and robot returns to idle | Failure state is announced and robot resets safely |

## Shared State Rules

- Only one primary robot action may be active at a time.
- A second trigger during an active action must follow one explicit product rule:
  ignore, queue, or replace. The implementation plan chooses `replace only if
  the current action is cancel-safe; otherwise ignore with feedback`.
- Loading, active, success, denied, unsupported, and error states must all have
  visible text feedback outside the canvas.
- The DOM control panel must remain available even when the canvas action fails.

## Accessibility Contract

- Every presenter control is keyboard reachable and has a readable label.
- The live status region must announce meaningful action changes.
- Canvas visuals cannot be the only source of critical feedback.
- Controls must remain understandable at desktop and tablet presentation sizes.
- Visual meaning cannot rely on color alone.

## Verification Evidence

- Route protection test for redirect behavior.
- Integration tests for each action's state transition path.
- Screenshot or video proof of loading, active, denied, and error states.
- Manual accessibility check for keyboard order and visible focus.