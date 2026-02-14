# Contributing to FlowForge

Thank you for your interest in contributing to FlowForge!

## Project Status

⚠️ **Early Development Stage** - The project is in its initial phase. Technology stack and architecture decisions are still being finalized.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists
2. Create a new issue with:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment details (OS, browser, versions)

### Suggesting Features

Feature suggestions are welcome! Please:

1. Describe the use case
2. Explain why this feature would be valuable
3. Consider implementation complexity
4. Discuss in issues before starting work

### Code Contributions

This project follows industry-standard development practices:
- **GitFlow** for branch management
- **Conventional Commits** for commit messages
- **Automated validation** via git hooks

#### GitFlow Workflow

We use GitFlow branching model for structured development:

**Main Branches:**
- `main` - Production-ready code, tagged releases only
- `develop` - Integration branch for features, always deployable

**Supporting Branches:**
- `feature/*` - New features (branch from `develop`, merge to `develop`)
- `bugfix/*` - Bug fixes for develop (branch from `develop`, merge to `develop`)
- `release/*` - Release preparation (branch from `develop`, merge to `main` and `develop`)
- `hotfix/*` - Critical production fixes (branch from `main`, merge to `main` and `develop`)

**Branch Naming Convention:**
```
feature/short-description
bugfix/issue-number-description
release/version-number
hotfix/critical-fix-description
```

Examples:
- `feature/visual-timer-node`
- `bugfix/123-connection-validation`
- `release/0.1.0`
- `hotfix/plc-deploy-crash`

#### Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd FlowForge
   ```

2. **Run the development setup script** (configures git hooks, commitlint, commit template):
   ```bash
   # Linux/macOS:
   ./scripts/setup-dev.sh

   # Windows (PowerShell):
   .\scripts\setup-dev.ps1
   ```

3. **Create appropriate branch** following GitFlow:
   ```bash
   # For new feature
   git checkout develop
   git checkout -b feature/your-feature-name
   
   # For bug fix
   git checkout develop
   git checkout -b bugfix/issue-123-description
   ```

5. **Make your changes** following coding standards

6. **Commit using Conventional Commits** (see below)

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request** to the appropriate branch (`develop` for features/bugfixes)

#### Conventional Commits

All commit messages **MUST** follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Format:**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no code change)
- `refactor` - Code refactoring (no feature/fix)
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `build` - Build system or dependencies
- `ci` - CI/CD configuration
- `chore` - Other changes (maintenance, tooling)
- `revert` - Revert previous commit

**Scopes** (optional but recommended):
- `frontend` - Visual editor changes
- `backend` - API server changes
- `build-server` - PLC build server changes
- `monitor-server` - Monitor server changes
- `docs` - Documentation
- `config` - Configuration files
- `deps` - Dependencies

**Examples:**
```bash
# Simple feature
git commit -m "feat(frontend): add timer node to node library"

# Bug fix with scope
git commit -m "fix(backend): resolve project save error on special characters"

# With body and footer
git commit -m "feat(build-server): add support for structured text generation

Implement ST code generation for basic logic nodes including
AND, OR, NOT gates with proper IEC 61131-3 syntax.

Closes #45"

# Breaking change
git commit -m "feat(frontend)!: change project format to JSON

BREAKING CHANGE: Projects now use JSON instead of XML.
Migration tool provided in scripts/migrate-xml-to-json.js"

# Documentation
git commit -m "docs: add gitflow workflow to contributing guide"

# Chore
git commit -m "chore(deps): update react to v18.2.0"
```

**Breaking Changes:**
- Add `!` after type/scope: `feat!:` or `feat(scope)!:`
- Include `BREAKING CHANGE:` in footer with description

**Commit Message Validation:**

Commit messages are validated automatically using git hooks. Invalid commits will be rejected.

To test your commit message before committing:
```bash
# Message validation will run on commit
git commit -m "your message"

# If invalid, you'll see an error like:
# ❌ Commit message does not follow Conventional Commits format
```

**Good Practices:**
- Use present tense: "add feature" not "added feature"
- Use imperative mood: "fix bug" not "fixes bug"
- Keep first line under 72 characters
- Reference issues: `Closes #123`, `Fixes #456`, `Relates to #789`
- Write descriptive body for complex changes

#### Coding Standards

Once technology stack is finalized, we'll establish:
- Code formatting rules (ESLint, Prettier, etc.)
- Naming conventions
- Documentation requirements
- Testing requirements

**Current Standards:**
- Use meaningful variable and function names
- Comment complex logic
- Follow SOLID principles
- Write testable code
- Update relevant documentation

#### Development Workflow

**Typical Feature Development:**

1. Create feature branch from `develop`
2. Implement changes with frequent, atomic commits
3. Write/update tests
4. Update documentation
5. Push and create PR to `develop`
6. Address review comments
7. Merge after approval

**Release Process:**

1. Create `release/x.y.z` branch from `develop`
2. Update version numbers and changelog
3. Test thoroughly
4. Merge to `main` and tag with version
5. Merge back to `develop`
6. Deploy from `main`

### Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add examples in `samples/` directory
- Improve API documentation in `doc/`
- Translate documentation (future)

### Testing

Tests should be placed in the `test/` directory:
- Unit tests for individual components
- Integration tests for end-to-end workflows
- Example projects for validation

*Detailed testing guidelines will be added once testing framework is set up*

## Technology Decisions

If you have opinions on pending technology choices:

1. Review [DECISION_LOG.md](doc/DECISION_LOG.md)
2. Share your experience/reasoning in discussions
3. Consider trade-offs for this project's specific needs

## Communication

- **Issues**: For bugs and feature requests
- **Discussions**: For questions and general conversation
- **Pull Requests**: For code contributions

## Code of Conduct

Be respectful and professional:
- Constructive feedback
- Inclusive language
- Focus on ideas, not individuals
- Help newcomers

## License

By contributing, you agree that your contributions will be licensed under the project's license. See [LICENSE.md](LICENSE.md) for details.

---

Thank you for helping make visual PLC programming accessible to everyone!
