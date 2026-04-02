# Contributing

## Branching

Always branch off `main`. Use the following naming convention:

| Type     | Pattern           | Example                   |
| -------- | ----------------- | ------------------------- |
| Feature  | `feat/<name>`     | `feat/fatigue-model`      |
| Bug fix  | `fix/<name>`      | `fix/e1rm-calculation`    |
| Refactor | `refactor/<name>` | `refactor/workout-schema` |
| Chore    | `chore/<name>`    | `chore/update-deps`       |

Never commit directly to `main`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>
```

Types: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`, `chore`, `ci`, `revert`

- Lowercase, imperative mood, no period
- Max 72 characters
- Breaking changes: add `!` after type, e.g. `feat!: redesign fatigue schema`

## Pull Requests

- One concern per PR — don't mix features with refactors
- PR title should follow the same conventional commit format
- **All PRs are merged via squash merge** — your branch commits will be squashed into one clean commit on `main`
- Delete the branch after merging

## Local Development

```bash
npm install
npx expo start       # start dev server
```

Press `i` to open iOS Simulator, or scan the QR code with Expo Go on your phone.
