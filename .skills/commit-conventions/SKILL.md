---
name: commit-conventions
description: Use when preparing any commit in this repository to follow its evidenced commit-message conventions.
---

# Commit conventions

Before preparing a commit in this repository, use the following conventions supported by the project history. They describe observed practice, not a universal requirement where the history is mixed.

## Message format

- Recent scoped messages use `type(scope): short description`.
- The history also contains unscoped subjects such as `feat: ...` and `docs: ...`; a scope is therefore not universal.
- Use a concise description of the change. Commits from `f08e56f` onward are in Spanish; earlier course-template commits are in English and almost all omit the type, using subjects such as `Add...`, `Update...`, and `Fix...`.

## Types observed in scoped history

- `feat`: introduce functionality or a capability (e.g. `feat(fase-3)` adds repository rules).
- `fix`: correct an issue (e.g. `fix(a11y)` adjusts accessibility).
- `refactor`: reorganize implementation without stating a feature or bug fix (e.g. `refactor(types)` consolidates types).
- `perf`: performance improvement (e.g. `perf(react)` defers chart loading).
- `docs`: documentation/specification changes (e.g. `docs(specs)`).
- `chore`: maintenance/tooling changes (e.g. `chore(skills)` installs skills).

## Scopes observed

Use a scope that identifies the affected area when useful. Scopes present in history include `fase-1`, `fase-2`, `fase-3`, `fase-4`, `specs`, `skills`, `react`, `a11y`, and `types`. The history does not define an exhaustive or mandatory scope list.

## Form and body

- Separate type and scope with parentheses, then use a colon and a space before the description, as in `fix(a11y): ...`.
- Use lowercase type and scope where following the scoped pattern; observed scoped subjects use lowercase.
- Some historical descriptions capitalize their first word and some do not. No capitalization rule is established.
- Of the 41 commits inspected with `git log --all --format='%h%n%s%n%b%n---'`, 10 have a non-empty body; the history does not establish a required body format.
- Subject lengths vary; no maximum length is established by the history.

## Examples from this repository

- `fix(a11y): títulos de gráficas como h2, role=alert y lang=es en errores, título de página (skill accessibility)`
- `docs(specs): README con el contrato de datos de las tres funcionalidades`
- `chore(skills): agrega skill typescript-advanced-types desde skills.sh`
