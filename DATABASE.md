# Database Setup Documentation

## Overview
This project uses PostgreSQL as the database and Prisma as the ORM (Object-Relational Mapping) tool.

## Architecture

### Database: PostgreSQL 15
- **Container**: Running via Docker Compose
- **Port**: 5432 (default)
- **Credentials**: 
  - User: `devops_user`
  - Password: `devops_password`
  - Database: `devops_db`

### ORM: Prisma
- **Version**: Latest (6.x)
- **Client**: Auto-generated TypeScript types
- **Migrations**: Version-controlled SQL migrations
- **Studio**: Web-based database GUI

## Data Models

### User
Represents a user in the system.

**Fields:**
- `id` (Int, Primary Key, Auto-increment)
- `email` (String, Unique) - User's email address
- `name` (String) - User's full name
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Record update timestamp

**Relations:**
- Has many `tasks`

### Task
Represents a task assigned to a user.

**Fields:**
- `id` (Int, Primary Key, Auto-increment)
- `title` (String) - Task title
- `description` (String?, Optional) - Task description
- `status` (String, Default: "pending") - Task status
- `priority` (String, Default: "medium") - Task priority level
- `dueDate` (DateTime?, Optional) - Task due date
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Record update timestamp
- `userId` (Int, Foreign Key) - Reference to the user

**Relations:**
- Belongs to one `user`

**Constraints:**
- `CASCADE` delete: When a user is deleted, all their tasks are deleted
- Indexed on `userId` for faster queries
- Indexed on `status` for faster status filtering

## Database Operations

### Starting the Database
```bash
npm run docker:up
```
This starts the PostgreSQL container in detached mode.

### Stopping the Database
```bash
npm run docker:down
```
This stops and removes the PostgreSQL container (data persists in volume).

### Viewing Database Logs
```bash
npm run docker:logs
```

## Migrations

### Creating a New Migration
```bash
npm run db:migrate
```
This will:
1. Prompt for a migration name
2. Generate migration SQL files
3. Apply the migration to the database
4. Regenerate Prisma Client

### Applying Migrations (Production)
```bash
npm run db:migrate:deploy
```
Use this in production/CI environments to apply pending migrations.

### Migration Files Location
`prisma/migrations/` - Contains timestamped migration folders with SQL files.

### Checking Migration Status
```bash
npx prisma migrate status
```

### Rolling Back
Prisma doesn't support automatic rollbacks. To revert:
1. Create a new migration that reverses the changes
2. Or reset the database: `npm run db:reset`

## Seeding

### Running the Seed Script
```bash
npm run db:seed
```

The seed script (`prisma/seed.ts`):
1. Clears existing data
2. Creates 3 sample users
3. Creates 8 sample tasks (distributed among users)

### Seed Data Contents
- **Users**: John Doe, Jane Smith, Bob Wilson
- **Tasks**: Various tasks with different statuses and priorities

## Prisma Client Usage

### Importing Prisma Client
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

### Example Queries

**Find all users with their tasks:**
```typescript
const users = await prisma.user.findMany({
  include: {
    tasks: true,
  },
});
```

**Create a new user:**
```typescript
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    name: 'Test User',
  },
});
```

**Create a task:**
```typescript
const task = await prisma.task.create({
  data: {
    title: 'My Task',
    description: 'Task description',
    userId: 1,
  },
});
```

**Update a task:**
```typescript
const task = await prisma.task.update({
  where: { id: 1 },
  data: { status: 'completed' },
});
```

**Delete a task:**
```typescript
await prisma.task.delete({
  where: { id: 1 },
});
```

**Complex query with filters:**
```typescript
const tasks = await prisma.task.findMany({
  where: {
    status: 'pending',
    priority: 'high',
    dueDate: {
      lte: new Date(), // Due today or earlier
    },
  },
  include: {
    user: true,
  },
  orderBy: {
    dueDate: 'asc',
  },
});
```

See `src/database.ts` for more example functions.

## Prisma Studio

### Opening Prisma Studio
```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all data in tables
- Edit records
- Create new records
- Delete records
- Run custom queries

## Environment Variables

### Local Development
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default DATABASE_URL:
```
DATABASE_URL="postgresql://devops_user:devops_password@localhost:5432/devops_db?schema=public"
```

### CI/GitHub Actions
Override DATABASE_URL in workflow:
```yaml
env:
  DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db?schema=public
```

### Production
Set DATABASE_URL as an environment variable with your production database credentials.

## Database Reset

### Complete Reset
```bash
npm run db:reset
```

This will:
1. Drop the database
2. Recreate it
3. Run all migrations
4. Run the seed script

**⚠️ WARNING**: This deletes all data!

## Troubleshooting

### Cannot Connect to Database
1. Check if PostgreSQL is running: `docker compose ps`
2. Check logs: `npm run docker:logs`
3. Verify DATABASE_URL in `.env`

### Migration Errors
1. Check migration status: `npx prisma migrate status`
2. Try resetting: `npm run db:reset`
3. Check for manual schema changes

### Port Already in Use
If port 5432 is taken, edit `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use different host port
```

And update `.env`:
```
DATABASE_URL="postgresql://devops_user:devops_password@localhost:5433/devops_db?schema=public"
```

### Prisma Client Out of Sync
Regenerate the client:
```bash
npm run db:generate
```

## GitHub Actions Integration

The CI workflow (`.github/workflows/ci.yml`) includes:
1. PostgreSQL service container
2. Dependency installation
3. Prisma Client generation
4. Migration deployment
5. Database seeding
6. Verification

## Best Practices

1. **Always use migrations** - Never modify the database schema manually
2. **Version control migrations** - Commit migration files to git
3. **Test migrations** - Test in development before deploying to production
4. **Use transactions** - For operations that modify multiple records
5. **Close connections** - Always call `prisma.$disconnect()` when done
6. **Index important fields** - Add indexes for frequently queried fields
7. **Validate input** - Validate data before inserting into database
8. **Use relations** - Leverage Prisma's relation features for cleaner code

## Performance Tips

1. **Use select** to fetch only needed fields
2. **Use include** judiciously (avoid deep nesting)
3. **Add indexes** for frequently queried fields
4. **Use pagination** for large result sets
5. **Consider connection pooling** for production (PgBouncer)

## Security Considerations

1. **Never commit .env** - Keep credentials out of version control
2. **Use environment variables** - For all sensitive configuration
3. **Sanitize input** - Prisma helps prevent SQL injection
4. **Limit permissions** - Use least-privilege database users
5. **Enable SSL** - For production database connections

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
