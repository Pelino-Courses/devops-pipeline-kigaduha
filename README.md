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

