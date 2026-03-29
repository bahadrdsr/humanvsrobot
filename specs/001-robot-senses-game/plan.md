# Implementation Plan: Robot Senses Demo Game

**Branch**: `001-robot-senses-game` | **Date**: 2026-03-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-robot-senses-game/spec.md`

## Summary

Build a browser-based demo game for very young children where an authenticated
presenter lands directly in a robot interaction scene. React and React Router
will manage authentication, route protection, accessible DOM controls, and page
layout; Phaser 3 will own the real-time robot scene, animations, and action
state visualization. Tailwind CSS will style the presenter-facing shell and
fallback controls, Supabase will provide authentication and session metadata,
Spine will power the primary robot rig, DragonBones support will be integrated
behind an animation adapter for optional future rigs, and microphone/camera
features will be requested lazily with privacy-safe, no-retention defaults.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 22 LTS for tooling  
**Primary Dependencies**: React 19, React Router, Vite 6, Tailwind CSS 4, Phaser 3, Phaser Spine plugin, Phaser DragonBones plugin, Supabase JS client  
**Storage**: Supabase Auth and Postgres for presenter identity and session metadata; browser memory only for transient media and in-session robot state  
**Testing**: Vitest, React Testing Library, Playwright with mocked media devices, Lighthouse, manual rehearsal checklist for real device permissions  
**Target Platform**: Modern desktop and tablet browsers over HTTPS with WebGL, microphone, camera, and speech synthesis support  
**Project Type**: web application with hosted backend services  
**Performance Goals**: Main game view interactive within 3s after login, visible action acknowledgement within 1s, permission or capture feedback within 2s, robot scene sustaining 60 fps on target devices  
**Constraints**: No retention of microphone or camera data, protected routes for presenter-only access, graceful fallback when speech recognition is unsupported, child-friendly UI with accessible DOM controls, Spine runtime/editor version alignment, DragonBones limited to optional secondary rigs to control complexity  
**Scale/Scope**: Single presenter session, one primary robot character, five core actions, one main game route, low-concurrency demo usage with live device interactions  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Design Gate Review**

- Security: PASS. Trust boundaries are explicit: presenter authentication gates
  all gameplay, device permissions are requested lazily, media data is
  transient, and auth or permission failures are logged without exposing tokens
  or internal diagnostics to the child-facing UI.
- Performance: PASS. Targets are defined for login-to-play readiness, action
  acknowledgement, device-action feedback, and steady 60 fps rendering.
- UI Excellence: PASS. The design covers desktop and tablet presentation
  viewports, child-friendly feedback, primary/loading/active/denied/error
  states, and accessible fallback controls outside the canvas.
- Evidence: PASS. Reviewers will inspect unit and integration tests, Playwright
  flows with mocked devices, Lighthouse results, screenshots or recordings of
  each action state, and a manual rehearsal checklist on real hardware.
- Simplicity: PASS WITH JUSTIFICATION. React owns application state and Phaser
  owns the game loop to avoid cross-render contention. Dual skeletal runtimes
  are allowed only because the requested stack explicitly includes both Spine
  and DragonBones, and the design isolates them behind a shared animation
  adapter.

**Post-Design Re-Check**

- Security: PASS. Contracts and data model preserve least privilege, ephemeral
  media handling, and presenter-only route access.
- Performance: PASS. Research decisions constrain expensive rendering work to
  Phaser's WebGL path and keep DOM updates lightweight.
- UI Excellence: PASS. Contracts define fallback controls, live status
  messaging, and responsive layout expectations for supported viewports.
- Evidence: PASS. Quickstart and contract artifacts name the verification path
  for auth, permissions, action states, and performance checks.
- Simplicity: PASS WITH JUSTIFICATION. Hosted backend services avoid creating a
  custom server, and Phaser integration remains isolated to a single feature
  boundary instead of spreading engine concerns across the app shell.

## Project Structure

### Documentation (this feature)

```text
specs/001-robot-senses-game/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── game-ui-contract.md
│   └── presenter-session-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html
package.json
vite.config.ts
tailwind.config.ts
postcss.config.js
public/
└── assets/
    ├── audio/
    ├── dragonbones/
    ├── spine/
    └── textures/
src/
├── app/
│   ├── providers/
│   ├── router/
│   └── App.tsx
├── components/
│   ├── layout/
│   ├── status/
│   └── controls/
├── features/
│   ├── auth/
│   ├── game-shell/
│   ├── robot-actions/
│   ├── senses/
│   └── thinking/
├── lib/
│   ├── supabase/
│   ├── speech/
│   ├── permissions/
│   └── telemetry/
├── phaser/
│   ├── core/
│   ├── scenes/
│   ├── objects/
│   └── adapters/
├── styles/
└── main.tsx
tests/
├── contract/
├── integration/
└── unit/
```

**Structure Decision**: Use a single Vite application at the repository root.
This keeps deployment and local development simple while Supabase provides the
backend capabilities externally. React-facing code lives in `src/app`,
`src/components`, and `src/features`, while Phaser-specific code is isolated in
`src/phaser` so the game loop stays decoupled from routing, auth, and DOM-based
accessibility concerns.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dual skeletal animation plugins | The requested stack explicitly includes Spine and DragonBones, and the project may need to validate both asset pipelines during the demo build-out. | Using only one plugin would be simpler, but it would not satisfy the requested technology direction or allow comparison of animation assets. |
