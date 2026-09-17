# Note Cat

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Conventions

- Always put styles in a co-located `styles.ts` file (`StyleSheet.create` exported as `styles`). Never inline `StyleSheet.create` inside a component file.
- All commit messages must follow Conventional Commits and be written in English. Examples: `feat(home): add streak counter`, `fix(auth): handle expired session`, `chore: update dependencies`.
- When starting any task: create a branch from `develop` following Conventional Commits format (e.g. `feat/home-streak-counter`, `fix/auth-expired-session`, `chore/update-deps`), and open a PR when done.
