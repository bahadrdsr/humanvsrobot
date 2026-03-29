# Quickstart: Robot Senses Demo Game

## 1. Prerequisites

- Node.js 22 LTS and npm.
- A hosted authentication project configured for presenter access.
- HTTPS-capable local or preview environment for microphone and camera testing.
- Robot animation assets exported for the chosen skeletal runtime, with Spine
  and DragonBones plugin packages available to the app.

## 2. Scaffold The App

1. Create a Vite React TypeScript app at the repository root.
2. Add Tailwind CSS and configure the global design tokens for the presenter
   shell and fallback controls.
3. Add Phaser 3, React Router, the hosted auth client, and the required
   skeletal animation plugins.
4. Create environment configuration for hosted auth URL and public client key.

## 3. Implement The Architecture

1. Build the React application shell with `/login` and `/game` routes.
2. Add presenter authentication state management and route protection.
3. Create the Phaser bridge component that mounts exactly one game instance and
   destroys it cleanly on unmount.
4. Implement the robot scene, animation adapter, and the five core actions.
5. Add DOM-based presenter controls, live status messaging, and keyboard focus
   handling outside the canvas.
6. Add lazy microphone and camera permission flows for Hear and See.
7. Add the thinking prompt flow and safe replacement or ignore logic for
   overlapping actions.

## 4. Prepare Assets And Content

1. Place visual assets under `public/assets/`.
2. Keep only one primary robot skeletal runtime active in the main scene at a
   time.
3. Prepare a small set of child-friendly phrases, prompts, and feedback
   messages.

## 5. Run The App

1. Start the local development server.
2. Open the app in a supported HTTPS browser context.
3. Sign in as a presenter and confirm the app lands directly in `/game`.

## 6. Verify Core Flows

1. Trigger Speak and Jump and confirm visible feedback within 1 second.
2. Trigger Hear and confirm microphone permission is requested only on demand.
3. Trigger See and confirm camera permission is requested only on demand.
4. Trigger Think and confirm the prompt and response remain child-friendly.
5. Deny each permission once and confirm the game remains usable.

## 7. Evidence Checklist Before Implementation Is Considered Ready

1. Run unit and integration coverage for routing, state transitions, and action
   feedback.
2. Run browser integration tests with mocked media devices.
3. Capture Lighthouse evidence for performance and accessibility smoke checks.
4. Rehearse the full demo on actual presentation hardware and record any browser
   support caveats for speech recognition, camera access, or animation loading.

## 8. Validation Notes

- 2026-03-29: `npm run test` passed with 16 tests covering contracts, integration flows, accessibility smoke checks, and runtime fallback behavior.
- 2026-03-29: `npm run build` passed. The Phaser bundle is now lazy-loaded through the canvas boundary, but the build still warns that the generated game chunk is large and may benefit from additional code splitting when real animation assets are added.
- 2026-03-29: The current implementation uses a vector robot fallback because Spine and DragonBones asset exports are not present in `public/assets/` yet. The adapter boundary for both runtimes is in place.