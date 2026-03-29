---

description: "Task list for implementing the Robot Senses Demo Game feature"

---

# Tasks: Robot Senses Demo Game

**Input**: Design documents from `/specs/001-robot-senses-game/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Security, performance, and UI validation are required for this feature. Include automated coverage where practical and keep manual rehearsal evidence aligned with quickstart.md.

**Organization**: Tasks are grouped by user story so each story remains independently implementable and testable.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the root Vite application and baseline toolchain.

- [X] T001 Initialize the root Vite React TypeScript workspace in package.json
- [X] T002 Configure TypeScript and Vite entrypoints in tsconfig.json, tsconfig.node.json, vite.config.ts, and index.html
- [X] T003 [P] Configure Tailwind CSS and global style entry in tailwind.config.ts, postcss.config.js, and src/styles/index.css
- [X] T004 [P] Configure Vitest and Playwright scaffolding in vitest.config.ts, playwright.config.ts, and tests/setup.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Create the React bootstrap and provider composition in src/main.tsx, src/app/App.tsx, and src/app/providers/index.tsx
- [X] T006 [P] Configure hosted auth environment and Supabase client setup in .env.example, src/lib/supabase/env.ts, and src/lib/supabase/client.ts
- [X] T007 [P] Implement shared telemetry types and sanitized logger primitives in src/lib/telemetry/events.ts and src/lib/telemetry/logger.ts
- [X] T008 [P] Implement shared robot action types and base action state machine in src/features/robot-actions/types.ts and src/features/robot-actions/actionMachine.ts
- [X] T009 [P] Implement Phaser game bootstrap and React mount boundary in src/phaser/core/createGame.ts and src/features/game-shell/PhaserCanvas.tsx
- [X] T010 Implement the Spine-first animation adapter and primary runtime integration in src/phaser/adapters/animationAdapter.ts and src/phaser/adapters/spineRuntime.ts
- [X] T011 Implement root route shell and protected navigation scaffolding in src/app/router/index.tsx and src/components/layout/AppShell.tsx
- [X] T012 [P] Create shared test utilities and mocked media helpers in tests/utils/renderWithProviders.ts and tests/utils/mockMediaDevices.ts

**Checkpoint**: Foundation ready. User story implementation can now proceed.

---

## Phase 3: User Story 1 - Start The Robot Demo (Priority: P1) 🎯 MVP

**Goal**: Let a presenter authenticate, land directly in the game view, and demonstrate the robot with Speak and Jump plus clear active-state feedback.

**Independent Test**: Sign in with presenter credentials, confirm redirect to `/game`, trigger Speak and Jump, and verify the robot responds visibly without device permissions.

### Validation for User Story 1

- [X] T013 [P] [US1] Add presenter session contract tests for protected route access in tests/contract/presenter-session.contract.test.ts
- [X] T014 [P] [US1] Add login-to-game, sign-out, and first-action timing coverage in tests/integration/presenter-login-flow.spec.ts
- [X] T015 [P] [US1] Add UI and accessibility validation for the game shell and live status region in tests/integration/game-shell-accessibility.spec.ts

### Implementation for User Story 1

- [X] T016 [P] [US1] Implement presenter auth provider and session hook in src/app/providers/AuthProvider.tsx and src/features/auth/usePresenterSession.ts
- [X] T017 [US1] Implement the login page and protected-route redirect flow in src/features/auth/LoginPage.tsx, src/features/auth/ProtectedRoute.tsx, and src/app/router/index.tsx
- [X] T018 [P] [US1] Define the Speak and Jump action catalog and status copy in src/features/robot-actions/actionCatalog.ts and src/features/robot-actions/statusMessages.ts
- [X] T019 [US1] Implement the game page layout, presenter control panel, live status region, and sign-out control in src/features/game-shell/GamePage.tsx, src/components/controls/ActionPanel.tsx, and src/components/status/LiveStatus.tsx
- [X] T020 [US1] Implement RobotScene idle, Speak, and Jump flows in src/phaser/scenes/RobotScene.ts and src/phaser/objects/RobotController.ts
- [X] T021 [US1] Enforce single-active-action replacement and safe cancel behavior in src/features/robot-actions/useRobotActionController.ts and src/phaser/scenes/RobotScene.ts
- [X] T022 [US1] Add auth success, auth failure, session-ended, and action completion telemetry in src/lib/telemetry/logger.ts, src/features/auth/usePresenterSession.ts, and src/features/robot-actions/useRobotActionController.ts

**Checkpoint**: User Story 1 should now support the core presenter demo loop and act as the MVP.

---

## Phase 4: User Story 2 - Show Robot Senses (Priority: P2)

**Goal**: Let the robot hear and see with permission-aware microphone and camera flows, repeat-back behavior, and resilient fallbacks.

**Independent Test**: From the authenticated game view, trigger Hear and See with both granted and denied permissions, confirm repeat-back and camera preview on success, and confirm graceful fallback messaging on failure.

### Validation for User Story 2

- [X] T023 [P] [US2] Add sense interaction contract tests for permission and cleanup rules in tests/contract/sense-interaction.contract.test.ts
- [X] T024 [P] [US2] Add Hear and See integration coverage for granted and denied states plus permission feedback timing in tests/integration/senses-flow.spec.ts
- [X] T025 [P] [US2] Add UI and accessibility validation for transcript, preview, and fallback states in tests/integration/senses-accessibility.spec.ts

### Implementation for User Story 2

- [X] T026 [P] [US2] Implement browser permission helpers for microphone and camera in src/lib/permissions/devicePermissions.ts and src/lib/permissions/permissionStatus.ts
- [X] T027 [P] [US2] Implement speech recognition and speech synthesis wrappers in src/lib/speech/recognition.ts and src/lib/speech/synthesis.ts
- [X] T028 [US2] Implement sense controller state and ephemeral cleanup rules in src/features/senses/useSenseController.ts and src/features/senses/senseStore.ts
- [X] T029 [US2] Implement Hear action transcript, repeat-back, and fallback UI in src/features/senses/HearAction.tsx, src/components/status/LiveStatus.tsx, and src/features/robot-actions/useRobotActionController.ts
- [X] T030 [US2] Implement See action camera preview and robot look-state integration in src/features/senses/CameraPreview.tsx, src/features/senses/useSenseController.ts, and src/phaser/scenes/RobotScene.ts
- [X] T031 [US2] Add permission-denied, unsupported-browser, and no-speech telemetry handling in src/lib/telemetry/logger.ts and src/features/senses/useSenseController.ts

**Checkpoint**: User Story 2 should now demonstrate the robot hearing and seeing while preserving the rest of the game when devices or permissions fail.

---

## Phase 5: User Story 3 - Show Robot Thinking (Priority: P3)

**Goal**: Let the robot ask a simple age-appropriate prompt, evaluate the answer, and respond with playful feedback.

**Independent Test**: From the authenticated game view, trigger Think, complete a simple prompt with correct and incorrect answers, and verify visible and spoken feedback without breaking other actions.

### Validation for User Story 3

- [X] T032 [P] [US3] Add think prompt contract tests for prompt evaluation and feedback rules in tests/contract/think-prompt.contract.test.ts
- [X] T033 [P] [US3] Add Think flow integration coverage for completion, action conflict handling, and response timing in tests/integration/think-flow.spec.ts
- [X] T034 [P] [US3] Add UI and accessibility validation for prompt cues and answer submission in tests/integration/think-accessibility.spec.ts

### Implementation for User Story 3

- [X] T035 [P] [US3] Define the child-friendly prompt catalog and answer evaluator in src/features/thinking/prompts.ts and src/features/thinking/evaluateAnswer.ts
- [X] T036 [US3] Implement think controller state management in src/features/thinking/useThinkController.ts and src/features/thinking/thinkStore.ts
- [X] T037 [US3] Implement the Think panel and answer submission UI in src/features/thinking/ThinkPanel.tsx and src/components/controls/ActionPanel.tsx
- [X] T038 [US3] Integrate Think action animation and feedback in src/phaser/scenes/RobotScene.ts and src/components/status/LiveStatus.tsx
- [X] T039 [US3] Record think outcomes, skipped prompts, and result feedback telemetry in src/lib/telemetry/logger.ts and src/features/thinking/useThinkController.ts

**Checkpoint**: User Story 3 should now add the final educational interaction without regressing previous stories.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improve documentation, resilience, and cross-story quality checks.

- [X] T040 [P] Document local setup, environment variables, and presenter controls in README.md
- [X] T041 Harden token redaction, session expiry handling, and child-safe error messaging in src/features/auth/ProtectedRoute.tsx, src/lib/telemetry/logger.ts, and src/components/status/LiveStatus.tsx
- [X] T042 Run Lighthouse and action-latency smoke coverage in lighthouserc.json and tests/integration/performance-smoke.spec.ts
- [X] T043 [P] Add cross-story accessibility and responsive regression coverage in tests/integration/accessibility-smoke.spec.ts and src/styles/index.css
- [X] T044 Record rehearsal results and quickstart validation notes in specs/001-robot-senses-game/quickstart.md
- [X] T045 [P] Integrate DragonBones runtime behind the shared animation adapter and add asset smoke coverage in src/phaser/adapters/dragonBonesRuntime.ts and tests/integration/animation-runtime-smoke.spec.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies.
- Foundational (Phase 2): Depends on Phase 1 and blocks all user stories.
- User Story phases (Phase 3 onward): Depend on Phase 2.
- Polish (Phase 6): Depends on all desired user stories being complete.

### User Story Dependencies

- User Story 1 (P1): Starts immediately after Foundational and delivers the MVP.
- User Story 2 (P2): Starts after Foundational and builds on the game shell introduced in US1, but remains independently testable once merged.
- User Story 3 (P3): Starts after Foundational and reuses the shared shell and action framework from earlier phases while remaining independently testable.

### Within Each User Story

- Validation tasks should be completed first whenever they define the most reliable evidence path.
- Shared data and state definitions should exist before controller logic.
- Controller logic should exist before route, UI, or scene integration.
- Telemetry and fallback handling must be completed before the story is considered done.

### Parallel Opportunities

- T003 and T004 can run in parallel after T001.
- T006, T007, T008, T009, and T012 can run in parallel after T005.
- In US1, T013, T014, T015, T016, and T018 can run in parallel before UI and scene integration.
- In US2, T023, T024, T025, T026, and T027 can run in parallel before sense integration.
- In US3, T032, T033, T034, and T035 can run in parallel before prompt UI integration.
- T040 and T043 can run in parallel during Polish.

---

## Parallel Example: User Story 1

```bash
Task: "Add presenter session contract tests in tests/contract/presenter-session.contract.test.ts"
Task: "Add login-to-game integration coverage in tests/integration/presenter-login-flow.spec.ts"
Task: "Implement presenter auth provider and session hook in src/app/providers/AuthProvider.tsx and src/features/auth/usePresenterSession.ts"
Task: "Define the Speak and Jump action catalog in src/features/robot-actions/actionCatalog.ts and src/features/robot-actions/statusMessages.ts"
```

## Parallel Example: User Story 2

```bash
Task: "Add sense interaction contract tests in tests/contract/sense-interaction.contract.test.ts"
Task: "Implement browser permission helpers in src/lib/permissions/devicePermissions.ts and src/lib/permissions/permissionStatus.ts"
Task: "Implement speech wrappers in src/lib/speech/recognition.ts and src/lib/speech/synthesis.ts"
```

## Parallel Example: User Story 3

```bash
Task: "Add think prompt contract tests in tests/contract/think-prompt.contract.test.ts"
Task: "Add Think flow integration coverage in tests/integration/think-flow.spec.ts"
Task: "Define the prompt catalog and answer evaluator in src/features/thinking/prompts.ts and src/features/thinking/evaluateAnswer.ts"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate login, protected route behavior, Speak, Jump, and live status feedback before moving on.

### Incremental Delivery

1. Deliver User Story 1 as the first usable presenter demo.
2. Add User Story 2 for Hear and See with permission-safe fallbacks.
3. Add User Story 3 for Think.
4. Finish with cross-story polish, Lighthouse checks, and rehearsal notes.

### Parallel Team Strategy

1. One developer can handle app bootstrap and auth while another sets up Phaser core and test utilities during Phases 1 and 2.
2. After Foundational completes, US1 should stay prioritized while parallel validation work begins for US2 and US3.
3. Polish tasks can be split across documentation, accessibility, and performance workstreams.

---

## Notes

- [P] marks tasks that are safe to run in parallel because they touch separate files or isolated concerns.
- Every user story includes explicit evidence tasks for security, performance, or UI quality.
- The suggested MVP scope is User Story 1 only.
- Avoid starting US2 or US3 implementation before Foundational is stable, because auth, route protection, and the Phaser boundary are shared dependencies.