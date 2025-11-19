# devops-pipeline-kigaduha
End-to-End DevOps Pipeline Implementation

## Project Overview
This project implements a complete DevOps pipeline with PostgreSQL database, Prisma ORM, and automated migrations for a task management system.

## Features
- ✅ PostgreSQL database running in Docker
- ✅ Prisma ORM with TypeScript support
- ✅ User and Task models with 1-to-many relationship
- ✅ Database migrations system
- ✅ Seed script with sample data
- ✅ Docker Compose for local development

## Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/dukuzejean09/devops-pipeline-kigaduha.git
cd devops-pipeline-kigaduha
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
# Edit .env if needed (default values work for local development)
```

### 4. Start PostgreSQL database
```bash
npm run docker:up
```

### 5. Run database migrations
```bash
npm run db:migrate
```

### 6. Seed the database with sample data
```bash
npm run db:seed
```

## Database Schema

### User Model
- `id` (Int): Auto-incrementing primary key
- `email` (String): Unique email address
- `name` (String): User's full name
- `createdAt` (DateTime): Timestamp of creation
- `updatedAt` (DateTime): Timestamp of last update
- `tasks` (Task[]): One-to-many relationship with tasks

### Task Model
- `id` (Int): Auto-incrementing primary key
- `title` (String): Task title
- `description` (String?): Optional task description
- `status` (String): Task status (default: "pending")
- `priority` (String): Task priority (default: "medium")
- `dueDate` (DateTime?): Optional due date
- `createdAt` (DateTime): Timestamp of creation
- `updatedAt` (DateTime): Timestamp of last update
- `userId` (Int): Foreign key to User
- `user` (User): Many-to-one relationship with user

## Available Scripts

### Database Commands
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Create and apply a new migration
- `npm run db:migrate:deploy` - Apply migrations (production)
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (drops all data)
- `npm run db:studio` - Open Prisma Studio (GUI for database)

### Docker Commands
- `npm run docker:up` - Start PostgreSQL container
- `npm run docker:down` - Stop PostgreSQL container
- `npm run docker:logs` - View PostgreSQL logs

### Build Commands
- `npm run build` - Compile TypeScript to JavaScript

## Development Workflow

### Making Schema Changes
1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate` to create and apply migration
3. Prisma Client will be automatically regenerated

### Resetting the Database
```bash
npm run db:reset
```
This will drop the database, recreate it, run all migrations, and run the seed script.

### Viewing Database Data
```bash
npm run db:studio
```
Opens Prisma Studio at http://localhost:5555

## Testing

The database setup is designed to work with GitHub Actions CI/CD. The workflow includes:
- PostgreSQL service container
- Automated migration deployment
- Test database setup

## Project Structure
```
.
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma       # Database schema definition
│   └── seed.ts            # Database seed script
├── docker-compose.yml     # PostgreSQL Docker configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies and scripts
├── .env                 # Environment variables (local)
└── .env.example        # Environment variables template
```

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
  - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`
  - Default: `postgresql://devops_user:devops_password@localhost:5432/devops_db?schema=public`

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL container is running: `docker compose ps`
2. Check container logs: `npm run docker:logs`
3. Verify DATABASE_URL in `.env` file

### Migration Issues
- Reset database: `npm run db:reset`
- Check migration status: `npx prisma migrate status`

### Port Conflicts
If port 5432 is already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Change host port to 5433
```
And update DATABASE_URL in `.env`:
```
DATABASE_URL="postgresql://devops_user:devops_password@localhost:5433/devops_db?schema=public"
```

## Contributing
Please read the issue templates in `.github/ISSUE_TEMPLATE/` for contribution guidelines.

## License
See LICENSE file for details.

# DevOps Pipeline Kigaduha

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/dukuzejean09/devops-pipeline-kigaduha)](https://github.com/dukuzejean09/devops-pipeline-kigaduha/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/dukuzejean09/devops-pipeline-kigaduha)](https://github.com/dukuzejean09/devops-pipeline-kigaduha/pulls)
[![Project Board](https://img.shields.io/badge/Project-Board-brightgreen)](https://github.com/users/dukuzejean09/projects/2)

End-to-End DevOps Pipeline Implementation with automated CI/CD, infrastructure as code, and comprehensive project management.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Board Automation](#project-board-automation)
- [Contributing](#contributing)
- [Branch Protection Rules](#branch-protection-rules)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

---

## 🎯 Overview

DevOps Pipeline Kigaduha is a comprehensive DevOps implementation project that demonstrates best practices for continuous integration, continuous deployment, infrastructure management, and automated project workflows. This repository serves as a template and learning resource for building robust DevOps pipelines.

### Key Objectives

- Implement automated CI/CD pipelines using GitHub Actions
- Establish infrastructure as code practices
- Automate project management with GitHub Projects
- Enforce security best practices
- Maintain comprehensive documentation
- Foster collaborative development

---

## ✨ Features

### Automated Project Management

- **Issue Automation**: New issues automatically added to project board (Backlog status)
- **Assignment Tracking**: Assigned issues move to "In Progress"
- **PR Tracking**: Pull requests automatically move to "In Review"
- **Completion Tracking**: Merged PRs move to "Done"

### Security & Quality

- Pre-commit hooks for code quality
- Dependabot for dependency updates
- Secret detection and scanning
- Code linting and formatting

### Developer Experience

- Issue templates for bugs, features, and DevOps tasks
- Comprehensive contribution guidelines
- Code of conduct for community standards
- Clear documentation and examples

---

## 📁 Project Structure

```
devops-pipeline-kigaduha/
├── .github/
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── devops_task.md
│   ├── workflows/              # GitHub Actions workflows
│   │   └── project-automation.yml
│   ├── dependabot.yml          # Dependabot configuration
│   └── CODEOWNERS              # Code ownership rules
├── CODE_OF_CONDUCT.md          # Community guidelines
├── CONTRIBUTING.md             # Contribution guide
├── LICENSE                     # Apache 2.0 License
├── README.md                   # This file
├── .gitignore                  # Git ignore rules
└── .pre-commit-config.yaml     # Pre-commit hooks configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following tools installed:

- **Git**: Version control system
- **Pre-commit**: For running pre-commit hooks (optional but recommended)
- **Python**: Required for some pre-commit hooks (Python 3.8+)
- **Node.js**: Required if working with JavaScript/TypeScript (Node 16+)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/dukuzejean09/devops-pipeline-kigaduha.git
   cd devops-pipeline-kigaduha
   ```

2. **Set up pre-commit hooks** (recommended):

   ```bash
   # Install pre-commit
   pip install pre-commit

   # Install the git hooks
   pre-commit install
   pre-commit install --hook-type commit-msg
   ```

3. **Run pre-commit on all files** (optional):

   ```bash
   pre-commit run --all-files
   ```

### Quick Start

1. **Fork the repository** on GitHub
2. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
4. **Commit with conventional commits**:

   ```bash
   git commit -m "feat: add new feature"
   ```

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

---

## 🔧 Development Workflow

### Branching Strategy

- `main`: Production-ready code (protected)
- `feature/*`: New features
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates
- `chore/*`: Maintenance tasks

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`

**Example**:
```
feat(ci): add automated testing workflow

Implement GitHub Actions workflow for running tests on pull requests.
Includes unit tests, integration tests, and code coverage reporting.

Closes #42
```

### Pre-commit Hooks

Pre-commit hooks automatically run checks before each commit:

- Trailing whitespace removal
- YAML/JSON syntax validation
- Large file detection
- Private key detection
- Markdown linting
- Shell script linting
- Secret detection

To bypass hooks (not recommended):
```bash
git commit --no-verify
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### Project Automation Workflow

**File**: `.github/workflows/project-automation.yml`

**Triggers**:
- Issue opened → Adds to project board (Backlog)
- Issue assigned → Moves to In Progress
- PR opened → Moves to In Review
- PR merged → Moves to Done

**Required Secret**: `PROJECTS_PAT` (GitHub Personal Access Token with project permissions)

### Setting Up CI/CD

1. **Generate a Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create token with `project` and `repo` scopes
   - Add as repository secret named `PROJECTS_PAT`

2. **Configure Project URL**:
   - Update project URL in `.github/workflows/project-automation.yml`
   - Default: `https://github.com/users/dukuzejean09/projects/2`

---

## 📊 Project Board Automation

Our project board follows this workflow:

```
Backlog → In Progress → In Review → Done
```

### Status Transitions

| Event | From | To |
|-------|------|-----|
| Issue opened | - | Backlog |
| Issue assigned | Backlog | In Progress |
| PR opened (linked) | In Progress | In Review |
| PR merged | In Review | Done |

### Using the Project Board

1. **Create an issue** using the appropriate template
2. **Assign yourself** when you start work (auto-moves to In Progress)
3. **Create a PR** and link it to the issue (auto-moves to In Review)
4. **Merge the PR** after approval (auto-moves to Done)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Check existing issues or create a new one
2. Fork the repository
3. Create a feature branch
4. Make your changes
5. Write/update tests
6. Update documentation
7. Submit a pull request

### Issue Templates

- **Bug Report**: Report bugs or unexpected behavior
- **Feature Request**: Suggest new features or enhancements
- **DevOps Task**: Infrastructure, CI/CD, or configuration tasks

---

## 🛡️ Branch Protection Rules

The `main` branch is protected with the following rules:

### Required for Merging

- ✅ Pull request reviews (at least 1 approval)
- ✅ Status checks must pass
- ✅ Branch must be up to date
- ✅ No direct pushes (use pull requests)

### Best Practices

- Create feature branches for all changes
- Keep commits focused and atomic
- Write descriptive PR descriptions
- Link PRs to related issues
- Respond to review feedback promptly

---

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- GitHub Actions community for workflow examples
- Contributor Covenant for the Code of Conduct
- All contributors who help improve this project

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/dukuzejean09/devops-pipeline-kigaduha/issues)
- **Project Board**: [GitHub Project](https://github.com/users/dukuzejean09/projects/2)
- **Maintainer**: [@dukuzejean09](https://github.com/dukuzejean09)

---

## 🗺️ Roadmap

- [ ] Add comprehensive CI/CD workflows
- [ ] Implement infrastructure as code (Terraform/Ansible)
- [ ] Set up containerization with Docker
- [ ] Configure Kubernetes deployments
- [ ] Add monitoring and observability
- [ ] Implement automated testing frameworks
- [ ] Create deployment strategies (blue-green, canary)

---

**Made with ❤️ for the DevOps community**
