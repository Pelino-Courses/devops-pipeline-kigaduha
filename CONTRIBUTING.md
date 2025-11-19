# Contributing to DevOps Pipeline Kigaduha

Thank you for your interest in contributing to the DevOps Pipeline Kigaduha project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/devops-pipeline-kigaduha.git
   cd devops-pipeline-kigaduha
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/dukuzejean09/devops-pipeline-kigaduha.git
   ```
4. **Install pre-commit hooks** (if available):
   ```bash
   pre-commit install
   ```

## How to Contribute

### Reporting Bugs

- Use the [Bug Report](../../issues/new?template=bug_report.md) template
- Check if the bug has already been reported
- Include detailed steps to reproduce
- Provide system information and error messages

### Suggesting Features

- Use the [Feature Request](../../issues/new?template=feature_request.md) template
- Clearly describe the feature and its benefits
- Explain why this feature would be useful to most users

### DevOps Tasks

- Use the [DevOps Task](../../issues/new?template=devops_task.md) template
- Clearly define the task scope and acceptance criteria
- Specify the component (CI/CD, Infrastructure, Security, etc.)

## Development Workflow

1. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   # or
   git checkout -b docs/your-documentation-update
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly:
   - Run existing tests
   - Add new tests for new functionality
   - Verify that all tests pass

4. **Commit your changes** with clear commit messages

5. **Keep your branch up to date**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**:
   ```bash
   git push origin your-branch-name
   ```

## Pull Request Process

1. **Update documentation** if needed (README, inline comments, etc.)

2. **Ensure all tests pass** and the code builds successfully

3. **Create a Pull Request** with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Link to related issues (use "Closes #123" or "Fixes #123")
   - Screenshots for UI changes (if applicable)

4. **Address review feedback** promptly and professionally

5. **Squash commits** if requested by maintainers

6. **Wait for approval** from at least one maintainer

7. **Merge** will be done by maintainers once approved

### Pull Request Checklist

- [ ] Code follows the project's coding standards
- [ ] Tests added/updated and all tests pass
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow the guidelines
- [ ] No merge conflicts with main branch
- [ ] PR description clearly explains the changes
- [ ] Related issues are linked

## Issue Guidelines

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check if the issue is already fixed in the latest version
- Gather all relevant information (logs, screenshots, etc.)

### When Creating an Issue

- Use the appropriate issue template
- Provide a clear and descriptive title
- Include all requested information in the template
- Add relevant labels
- Be responsive to questions and feedback

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow language-specific best practices
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable and function names

### Infrastructure as Code

- Use consistent naming conventions
- Include comments explaining non-obvious configurations
- Follow the principle of least privilege
- Never commit secrets or credentials
- Use variables and parameters for reusable components

### CI/CD Pipelines

- Keep workflows modular and reusable
- Add descriptive names to workflow steps
- Include error handling and validation
- Document required secrets and environment variables
- Test workflows on feature branches before merging

### Documentation

- Update README.md for user-facing changes
- Add inline documentation for complex code
- Include examples where helpful
- Keep documentation in sync with code changes

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code refactoring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates
- **ci**: CI/CD pipeline changes
- **build**: Build system or external dependency changes

### Examples

```
feat(api): add user authentication endpoint

Implement JWT-based authentication for the user API with 
login and logout functionality.

Closes #42
```

```
fix(ci): resolve Docker build failure in GitHub Actions

Updated Dockerfile to use correct base image version and 
fixed package installation issues.

Fixes #87
```

```
docs(readme): add installation instructions for Windows

Added step-by-step guide for setting up the project on 
Windows environments including WSL setup.
```

## Branch Protection Rules

The `main` branch is protected with the following rules:

- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- No direct pushes to main (except by administrators)

## Questions or Need Help?

- Check existing documentation and issues
- Ask in pull request or issue comments
- Contact project maintainers: @dukuzejean09

## Recognition

Contributors will be recognized in our project documentation and GitHub contributors page. Thank you for making this project better!

## License

By contributing to this project, you agree that your contributions will be licensed under the Apache License 2.0 (see [LICENSE](LICENSE)).
