# Git Workflow Guide

## Overview

This project uses **GitFlow** workflow with **Conventional Commits** for structured development and clear commit history.

## GitFlow Branch Strategy

### Permanent Branches

#### `main`
- **Purpose**: Production-ready code
- **Protected**: Yes, requires PR and approval
- **Contains**: Only stable, released versions
- **Tagged**: Every merge is tagged with version number (e.g., `v1.0.0`)
- **Deployed**: Automatic deployment to production

#### `develop`
- **Purpose**: Integration branch for ongoing development
- **Protected**: Yes, requires PR and approval  
- **Contains**: Latest development changes
- **Always**: Should be in deployable state
- **Source**: All feature branches merge here

### Temporary Branches

#### Feature Branches (`feature/*`)
- **Branch from**: `develop`
- **Merge to**: `develop`
- **Naming**: `feature/short-description` or `feature/issue-number-description`
- **Purpose**: Develop new features
- **Lifetime**: Until feature is complete and merged
- **Delete**: After merge to `develop`

**Examples:**
```bash
feature/visual-timer-node
feature/123-node-connection-validation
feature/plc-deployment-ui
```

**Workflow:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
# ... make changes ...
git commit -m "feat(frontend): add new feature"
git push origin feature/my-new-feature
# Create PR to develop
```

#### Bugfix Branches (`bugfix/*`)
- **Branch from**: `develop`
- **Merge to**: `develop`
- **Naming**: `bugfix/issue-number-description`
- **Purpose**: Fix bugs found in develop branch
- **Lifetime**: Until bug is fixed and merged
- **Delete**: After merge to `develop`

**Examples:**
```bash
bugfix/456-project-save-error
bugfix/connection-rendering-glitch
```

**Workflow:**
```bash
git checkout develop
git pull origin develop
git checkout -b bugfix/123-issue-description
# ... fix bug ...
git commit -m "fix(backend): resolve issue with database timeout"
git push origin bugfix/123-issue-description
# Create PR to develop
```

#### Release Branches (`release/*`)
- **Branch from**: `develop`
- **Merge to**: `main` AND `develop`
- **Naming**: `release/x.y.z` (semantic version)
- **Purpose**: Prepare new production release
- **Allowed**: Bug fixes, documentation, version bumps (no new features)
- **Lifetime**: Until release is deployed
- **Delete**: After merge to main and develop

**Examples:**
```bash
release/1.0.0
release/0.2.1
```

**Workflow:**
```bash
# Create release branch
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# Update version numbers
# package.json, version files, etc.
git commit -m "chore: bump version to 1.0.0"

# Update CHANGELOG.md
git commit -m "docs: update changelog for v1.0.0"

# Bug fixes only (if needed)
git commit -m "fix(build-server): minor issue in code generation"

# Merge to main
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/1.0.0
git push origin develop

# Delete release branch
git branch -d release/1.0.0
git push origin --delete release/1.0.0
```

#### Hotfix Branches (`hotfix/*`)
- **Branch from**: `main`
- **Merge to**: `main` AND `develop`
- **Naming**: `hotfix/critical-issue-description`
- **Purpose**: Emergency fixes for production
- **Lifetime**: Minimal (urgent fixes only)
- **Delete**: After merge to main and develop

**Examples:**
```bash
hotfix/plc-deployment-crash
hotfix/security-vulnerability
```

**Workflow:**
```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# Fix the critical issue
git commit -m "fix(build-server): resolve critical deployment crash"

# Update version (patch bump)
git commit -m "chore: bump version to 1.0.1"

# Merge to main
git checkout main
git merge --no-ff hotfix/critical-bug-fix
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin main --tags

# Merge to develop
git checkout develop
git merge --no-ff hotfix/critical-bug-fix
git push origin develop

# Delete hotfix branch
git branch -d hotfix/critical-bug-fix
git push origin --delete hotfix/critical-bug-fix
```

## Conventional Commits

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(frontend): add drag-drop support` |
| `fix` | Bug fix | `fix(backend): resolve null pointer exception` |
| `docs` | Documentation | `docs: update API documentation` |
| `style` | Formatting, no code change | `style(frontend): apply prettier formatting` |
| `refactor` | Code restructuring | `refactor(build-server): simplify code generation logic` |
| `perf` | Performance improvement | `perf(frontend): optimize canvas rendering` |
| `test` | Add/update tests | `test(backend): add unit tests for API endpoints` |
| `build` | Build system/dependencies | `build: update webpack configuration` |
| `ci` | CI/CD changes | `ci: add github actions workflow` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies` |
| `revert` | Revert previous commit | `revert: revert "feat: add feature X"` |

### Scopes

- `frontend` - Visual editor (src/frontend/)
- `backend` - API server (src/backend/)
- `build-server` - PLC build server (src/build-server/)
- `monitor-server` - Monitor server (src/monitor-server/)
- `docs` - Documentation
- `config` - Configuration files
- `ci` - CI/CD configuration
- `deps` - Dependencies

### Guidelines

1. **Use imperative mood**: "add feature" not "added feature"
2. **No period at end**: `fix: resolve bug` not `fix: resolve bug.`
3. **Max 72 characters** for header (includes `type(scope): ` prefix)
4. **Max 100 characters** per line in body
5. **Separate subject from body** with blank line
6. **Reference issues**: `Closes #123`, `Fixes #456`

> **Note**: `subject-case` is disabled — acronyms (DTO, MQTT, TwinCAT) are common in this project.

### Breaking Changes

Indicate breaking changes with `!` or `BREAKING CHANGE:` footer:

```bash
# Using !
git commit -m "feat(frontend)!: change project file format"

# Using footer
git commit -m "feat(frontend): change project file format

BREAKING CHANGE: Project files now use JSON instead of XML.
See migration guide in docs/MIGRATION.md"
```

## Pull Request Guidelines

### Creating a PR

1. **Update from target branch**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-branch
   git merge develop
   ```

2. **Push your branch**:
   ```bash
   git push origin your-branch
   ```

3. **Create PR** with:
   - Clear title following Conventional Commits
   - Description of changes
   - Link to related issues
   - Screenshots/demos if applicable

### PR Title Format

PR titles are validated by CI against the same commitlint rules. **Keep titles under 72 characters.**

```
feat(frontend): add visual timer node component
fix(backend): resolve project save error
docs: update git workflow documentation
```

> **Note**: PR title changes do NOT re-trigger CI. Push a commit to trigger a new check.

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Feature (feat)
- [ ] Bug Fix (fix)
- [ ] Documentation (docs)
- [ ] Refactoring (refactor)
- [ ] Other (specify)

## Related Issues
Closes #123
Relates to #456

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Commit messages follow Conventional Commits
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] All tests passing
```

### PR Review Process

1. **Automated checks**:
   - Commit message validation
   - Code linting
   - Unit tests
   - Build verification

2. **Code review**:
   - At least 1 approval required
   - Address all review comments
   - Keep discussion professional

3. **CLA check**:
   - First-time contributors must sign the CLA via PR comment
   - Org members are allowlisted and skip CLA signing
   - Signatures stored on `cla-signatures` branch

4. **Merge strategy**:
   - **Squash and merge** for feature/bugfix branches
   - **Merge commit** for release/hotfix branches
   - Delete source branch after merge

## Best Practices

### Commit Frequently

- Make small, atomic commits
- Each commit should be a logical unit
- Easier to review and revert if needed

### Keep Branches Updated

```bash
# Regularly sync with develop
git checkout your-branch
git fetch origin
git merge origin/develop
```

### Use Rebase (Optional)

For cleaner history before creating PR:
```bash
git checkout your-branch
git rebase develop
git push --force-with-lease origin your-branch
```

### Clean Up

- Delete merged branches
- Keep fork synchronized
- Regularly prune remote branches

## Versioning

We use [Semantic Versioning](https://semver.org/):

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

**Pre-release**: `1.0.0-alpha.1`, `1.0.0-beta.2`, `1.0.0-rc.1`

## Tools & Automation

### Commit Message Validation

Install commitlint (once Node.js tooling is set up):

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
npm install --save-dev husky
```

### Git Hooks

Hooks will be configured to:
- Validate commit messages (commit-msg)
- Run linters before commit (pre-commit)
- Run tests before push (pre-push)

### Commit Message Template

Configure locally:
```bash
git config commit.template .gitmessage
```

## Resources

- [GitFlow Original Article](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)

## Questions?

If you're unsure about workflow:
1. Check this guide
2. Ask in discussions
3. Look at merged PRs for examples
