# humanvsrobot

A browser-based robot presentation game for very young children. An authenticated presenter signs in and lands directly in a playful robot stage where the robot can speak, hear, see, think, and jump.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Phaser 3 with a Spine-first animation adapter and DragonBones support hook
- Supabase auth client with mock-mode fallback for local development
- Vitest for contract and integration coverage

## Getting Started

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and add Supabase credentials if you want hosted auth.
3. Start the dev server: `npm run dev`
4. Run tests: `npm run test`
5. Build for production: `npm run build`

## Presenter Controls

- `Speak`: the robot says a short phrase.
- `Hear`: the robot listens, then repeats the captured or typed phrase.
- `See`: the robot opens the camera preview until the presenter closes it.
- `Think`: the robot asks a simple, child-friendly prompt.
- `Jump`: the robot performs a quick movement action.
- `End session`: signs the presenter out and returns to the login route.

## Notes

- If Supabase keys are not configured, the app runs in mock auth mode for local development.
- The robot currently uses a vector fallback stage while Spine or DragonBones assets are still absent from `public/assets/`.
- Microphone and camera access are requested only when the presenter triggers Hear or See.# humanvsrobot
demo app for puddlejumpers
