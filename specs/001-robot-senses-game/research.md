# Research: Robot Senses Demo Game

## Decision: React owns auth, routing, and accessible DOM UI; Phaser owns the game loop

- Decision: Build the application as a React single-page app where React manages
  authentication state, route protection, layout, accessible controls, and live
  status messaging, while Phaser 3 manages the robot scene, animation timing,
  and in-canvas feedback.
- Rationale: React is strong for application shell concerns and semantic DOM,
  while Phaser is designed for real-time rendering and imperative scene
  lifecycles. Splitting responsibilities reduces frame drops caused by React
  rerenders touching the game loop.
- Alternatives considered: Rendering the game state entirely through React was
  rejected because it adds avoidable render pressure and complicates animation
  timing. Letting Phaser own the whole app shell was rejected because route
  guarding, auth state, and accessibility are easier to maintain in React.

## Decision: Use Supabase presenter authentication with guarded routes and external hosted services

- Decision: Use Supabase authentication to sign presenters in before loading the
  game route, with React Router route protection and a lightweight presenter
  session model stored in hosted backend services.
- Rationale: A hosted auth system avoids building a custom backend for a small
  demo while still satisfying the security requirement that only presenters can
  access the experience.
- Alternatives considered: Anonymous access was rejected because the spec
  requires login. A custom backend was rejected because it adds unnecessary
  operational complexity for a low-scale demo.

## Decision: Request microphone and camera lazily and treat all media as ephemeral

- Decision: Prompt for microphone or camera access only when the Hear or See
  action is triggered. Keep captured media transient in memory and discard it
  immediately after the interaction completes.
- Rationale: Lazy permission requests are more predictable in live demos and
  align with privacy-safe defaults. Not retaining audio or video simplifies
  compliance with the constitution and reduces risk.
- Alternatives considered: Requesting permissions at app startup was rejected
  because it adds friction and forces device trust before the presenter commits
  to those actions. Persisting recordings was rejected because it is outside the
  current feature scope and creates unnecessary privacy risk.

## Decision: Use browser-native speech synthesis and best-effort speech recognition with fallbacks

- Decision: Use Web Speech synthesis for robot voice output, use browser speech
  recognition where available for Hear, and provide visible fallback messaging
  or presenter-entered alternatives when recognition is unsupported or fails.
- Rationale: This keeps the implementation lightweight and aligns with the demo
  requirement that the robot can repeat what it hears without introducing a
  mandatory server-side speech processing pipeline.
- Alternatives considered: Cloud speech services were rejected because they add
  privacy, latency, and reliability concerns. Requiring speech recognition in
  all browsers was rejected because support is inconsistent.

## Decision: Use Spine as the primary robot rig and isolate Spine and DragonBones behind an animation adapter

- Decision: The main robot character will be authored and rendered through the
  Spine runtime. DragonBones plugin support will be integrated through the same
  Phaser adapter boundary for optional alternative assets or future expansion,
  but only one skeletal runtime will drive the primary robot in the scene at a
  time.
- Rationale: This honors the requested stack while limiting runtime complexity.
  Spine has a clearer primary-role fit for the main robot, and an adapter keeps
  the rest of the game code from depending directly on two competing animation
  runtimes.
- Alternatives considered: Using both runtimes directly in scene logic was
  rejected because it increases bundle size, state complexity, and cleanup risk.
  Using only one runtime was rejected because the requested build direction
  explicitly names both plugins.

## Decision: Ship accessible DOM controls alongside the Phaser canvas

- Decision: Provide large labeled action buttons, live status messaging, and
  keyboard-focusable controls outside the game canvas while mirroring action
  state visually within Phaser.
- Rationale: Canvas alone is insufficient for accessibility. DOM controls make
  the experience understandable, operable, and testable even when one modality
  such as audio or device access is unavailable.
- Alternatives considered: Canvas-only interaction was rejected because it
  would weaken accessibility and make presenter recovery harder during a live
  demo.

## Decision: Verify the experience with automated browser flows and manual device rehearsals

- Decision: Use Vitest and React Testing Library for unit and UI state coverage,
  Playwright for login and action-flow integration with mocked media devices,
  Lighthouse for performance and accessibility smoke checks, and a manual
  rehearsal checklist on actual presentation hardware.
- Rationale: Device permissions, speech support, and animation smoothness are
  not fully trustworthy in unit tests alone. A mixed verification strategy gives
  reviewers concrete evidence across security, performance, and UI behavior.
- Alternatives considered: Unit tests only were rejected because they cannot
  prove browser permission handling or real rendering behavior. Manual testing
  only was rejected because it is not reproducible enough for review.