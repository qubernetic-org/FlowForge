# Quick Start Guide

## Prerequisites

- **Git** (2.x or later)
- **Node.js** (18.x or later) and **npm** — required for commit message validation
- A code editor (Visual Studio Code recommended)

## Step 0: Clone and Set Up

```bash
# Clone the repository
git clone https://github.com/your-org/FlowForge.git
cd FlowForge
```

## Step 1: Run the Development Setup Script

The setup script configures everything you need to start contributing:

```bash
# Linux/macOS:
./scripts/setup-dev.sh

# Windows (PowerShell):
.\scripts\setup-dev.ps1
```

**What this does:**
1. Configures the git commit message template (`.gitmessage`) — shows format hints when you `git commit`
2. Installs Node.js dev dependencies (`commitlint`, `husky`)
3. Sets up a `commit-msg` git hook that automatically validates every commit message against [Conventional Commits](https://www.conventionalcommits.org/)
4. Runs a quick test to verify commitlint is working

If Node.js is not installed, the script will still configure the commit template but skip the automated validation.

## Step 2: Verify Your Setup

```bash
# Check that the commit template is configured
git config commit.template
# Expected output: .gitmessage

# Run the commit validation test suite
./scripts/test-commitlint.sh          # Linux/macOS
.\scripts\test-commitlint.ps1         # Windows
```

The test script validates 10 commit messages (valid and invalid) against the project's commitlint rules to confirm everything is working.

## Step 3: Create Your Branch

This project uses [GitFlow](doc/GIT_WORKFLOW.md). Always branch from `develop`:

```bash
git checkout develop
git pull origin develop

# For a new feature:
git checkout -b feature/your-feature-name

# For a bug fix:
git checkout -b bugfix/issue-123-description
```

## Step 4: Make Your First Commit

When you run `git commit` (without `-m`), the commit template will open in your editor with format hints. Follow the Conventional Commits format:

```bash
# Examples of valid commits:
git commit -m "feat(frontend): add timer node to node library"
git commit -m "fix(backend): resolve project save error"
git commit -m "docs: update quickstart guide"
```

If the message doesn't match the format, the commit hook will reject it with an error explaining what's wrong.

**Valid types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Valid scopes**: `frontend`, `backend`, `build-server`, `monitor-server`, `docs`, `config`, `deps`

## Troubleshooting

### Commit rejected by hook
Your commit message doesn't follow Conventional Commits. Check:
- Starts with a valid type (e.g., `feat:`, `fix:`)
- Subject is lowercase
- No period at end
- Max 72 characters in subject line

### `commitlint: command not found`
Run the setup script again or manually install:
```bash
npm install
```

### Hook not running at all
Ensure husky is initialized:
```bash
npx husky init
```

## What's Next

- Read the [Git Workflow Guide](doc/GIT_WORKFLOW.md) for branching and PR conventions
- Read [CONTRIBUTING.md](CONTRIBUTING.md) for full contributing guidelines
- Review the [Architecture](doc/ARCHITECTURE.md) to understand the system design
