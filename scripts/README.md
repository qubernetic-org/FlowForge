# Development Scripts

This directory contains utility scripts for development workflow automation.

## Available Scripts

### `setup-dev.sh` / `setup-dev.ps1`
**Purpose**: Initialize development environment and git configuration

**Usage:**
```bash
# Linux/macOS
./scripts/setup-dev.sh

# Windows (PowerShell)
.\scripts\setup-dev.ps1
```

**What it does:**
- Configures git commit message template
- Installs Node.js dependencies (commitlint, husky)
- Sets up git hooks for automatic commit message validation
- Tests the commitlint configuration
- Verifies git configuration
- Displays setup instructions

### `test-commitlint.sh` / `test-commitlint.ps1`
**Purpose**: Test commit message validation rules

**Usage:**
```bash
# Linux/macOS
./scripts/test-commitlint.sh

# Windows (PowerShell)
.\scripts\test-commitlint.ps1
```

**What it does:**
- Runs comprehensive test suite for commitlint
- Tests valid commit messages
- Tests invalid commit messages
- Reports pass/fail status

### Future Scripts

More scripts will be added as the project develops:
- `install-deps.sh` - Install all project dependencies
- `run-tests.sh` - Run all tests
- `build.sh` - Build all components
- `deploy.sh` - Deploy to PLC
- `validate-commits.sh` - Validate commit messages in branch

## Adding New Scripts

When adding new scripts:
1. Create both `.sh` (Unix) and `.ps1` (PowerShell) versions
2. Make Unix scripts executable: `chmod +x scripts/your-script.sh`
3. Add documentation here
4. Include error handling
5. Provide clear output messages
6. Follow existing script structure

## Best Practices

- Use clear, descriptive names
- Include help/usage information
- Handle errors gracefully
- Provide feedback on progress
- Make scripts idempotent (safe to run multiple times)
- Test on both Unix and Windows
