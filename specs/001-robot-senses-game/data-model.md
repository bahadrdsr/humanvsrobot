# Data Model: Robot Senses Demo Game

## Presenter Session

- Purpose: Represents authenticated presenter access to the demo experience.
- Fields:
  - `sessionId`: unique identifier for the active presenter session.
  - `presenterUserId`: hosted auth user identifier.
  - `status`: `anonymous | authenticating | authenticated | expired | signed-out`.
  - `issuedAt`: timestamp when the session became active.
  - `expiresAt`: timestamp when the session should be refreshed or ended.
  - `lastProtectedRoute`: last guarded route requested by the presenter.
- Relationships:
  - One Presenter Session can create many Demo Telemetry Events.
  - One Presenter Session owns zero or more Robot Action Executions during a run.
- Validation rules:
  - `presenterUserId` is required when `status=authenticated`.
  - Anonymous sessions cannot access the `/game` route.
  - Expired sessions must return to sign-in before protected actions resume.
- State transitions:
  - `anonymous -> authenticating -> authenticated`
  - `authenticated -> expired`
  - `authenticated -> signed-out`

## Robot Action Definition

- Purpose: Declares each child-visible robot capability available in the UI.
- Fields:
  - `actionId`: `speak | hear | see | think | jump`.
  - `label`: human-readable control label.
  - `kind`: `voice | sense | thinking | movement`.
  - `requiresPermission`: `none | microphone | camera`.
  - `cooldownMs`: minimum re-trigger interval.
  - `supportsFallback`: whether a degraded-mode experience exists.
- Relationships:
  - One Robot Action Definition can have many Robot Action Executions.
- Validation rules:
  - `actionId` must be unique.
  - `requiresPermission` must align with action kind.
  - Actions exposed in UI must define a fallback or explicit unavailability state.

## Robot Action Execution

- Purpose: Tracks one run of a robot action and the feedback shown to the
  presenter and child.
- Fields:
  - `executionId`: unique identifier for the triggered action instance.
  - `actionId`: reference to Robot Action Definition.
  - `status`: `idle | starting | active | succeeded | failed | cancelled`.
  - `triggeredAt`: start timestamp.
  - `completedAt`: completion timestamp when applicable.
  - `feedbackMessage`: plain-language status or outcome shown in the UI.
  - `visualState`: animation or overlay state identifier.
  - `errorCode`: normalized error identifier when failure occurs.
- Relationships:
  - Many Robot Action Executions belong to one Presenter Session.
  - Sense-driven executions may reference one Sense Interaction.
  - Think executions may reference one Think Prompt result.
- Validation rules:
  - Only one execution can be `active` for the primary robot at a time.
  - `completedAt` is required for `succeeded`, `failed`, and `cancelled`.
  - `feedbackMessage` must exist for failure and denial states.
- State transitions:
  - `idle -> starting -> active -> succeeded`
  - `active -> failed`
  - `starting | active -> cancelled`

## Sense Interaction

- Purpose: Represents a single microphone or camera attempt and its permission
  and capture outcome.
- Fields:
  - `senseInteractionId`: unique identifier.
  - `mode`: `hear | see`.
  - `permissionState`: `unknown | granted | denied | unsupported`.
  - `deviceState`: `idle | requesting | active | completed | failed`.
  - `transcript`: short recognized phrase for Hear when available.
  - `previewVisible`: whether live camera preview is currently shown.
  - `startedAt`: timestamp when device interaction began.
  - `endedAt`: timestamp when device interaction ended.
- Relationships:
  - One Sense Interaction is associated with exactly one Robot Action Execution.
- Validation rules:
  - `transcript` must be cleared after the execution completes unless explicitly
    retained by a future approved feature.
  - `previewVisible` can only be true when `mode=see` and `deviceState=active`.
  - `permissionState=denied` must produce a fallback feedback message.
- State transitions:
  - `unknown -> requesting -> active -> completed`
  - `unknown -> requesting -> failed`
  - `unknown -> denied`
  - `unknown -> unsupported`

## Think Prompt

- Purpose: Represents a simple child-friendly question and the outcome of the
  interaction.
- Fields:
  - `promptId`: unique identifier.
  - `promptText`: question shown or spoken by the robot.
  - `promptType`: `counting | simple-addition | matching`.
  - `answerOptions`: optional presenter-visible choices.
  - `expectedAnswer`: normalized answer used for evaluation.
  - `submittedAnswer`: normalized answer provided during the interaction.
  - `result`: `unanswered | correct | incorrect | skipped`.
  - `resultMessage`: positive or corrective child-friendly response.
- Relationships:
  - One Think Prompt may be referenced by one Robot Action Execution at a time.
- Validation rules:
  - Prompt content must remain age-appropriate and short.
  - Result feedback must avoid punitive language.
  - A prompt cannot be marked `correct` or `incorrect` without a submitted answer.
- State transitions:
  - `unanswered -> correct`
  - `unanswered -> incorrect`
  - `unanswered -> skipped`

## Demo Telemetry Event

- Purpose: Captures reviewable operational events without storing sensitive
  media payloads.
- Fields:
  - `eventId`: unique identifier.
  - `sessionId`: reference to Presenter Session.
  - `eventType`: `login_success | login_failure | permission_denied | action_failed | action_completed | session_ended`.
  - `eventAt`: timestamp of the event.
  - `actionId`: optional action reference.
  - `severity`: `info | warning | error`.
  - `details`: sanitized structured metadata with no raw tokens or retained media.
- Relationships:
  - Many Demo Telemetry Events belong to one Presenter Session.
- Validation rules:
  - `details` must never include raw authentication tokens, raw audio, or raw
    video content.
  - `eventType=permission_denied` must include the denied capability.
  - `eventType=login_failure` must expose only sanitized error details.