# Git Commit Guidelines for Roadside Assistance Project

This document outlines best practices for making commits to the Roadside Assistance project repository.

## Commit Message Format

Each commit message should consist of:

1. A short summary line (50 chars or less)
2. A blank line
3. A more detailed description
4. A list of specific files changed and what changed in them

Example:

```
Add user authentication with JWT

Implement user authentication using JSON Web Tokens for secure API access.
This includes login, registration, and token validation middleware.

- server/routes/auth.js: Add login and register endpoints
- server/middleware/auth.js: Add JWT validation middleware
- server/models/User.js: Update user model with password hashing
```

## Commit Frequency

- Make small, focused commits that address a single concern
- Commit logical units of work rather than large batches of unrelated changes
- Commit frequently to provide a clear history of development

## Commit Categories

Use these prefixes for your commit summary line:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `test:` - Adding or updating tests
- `chore:` - Changes to the build process, tools, etc.

Example: `feat: Add Google Maps integration for location services`

## Interactive Staging

Use Git's interactive staging to commit specific parts of files:

```bash
git add -i
# or
git add -p
```

This allows you to select which changes to include in a commit, making it easier to create focused commits.

## Branch Strategy

- `master` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Feature branches
- `fix/bug-name` - Bug fix branches

Always create a new branch for new features or bug fixes.
