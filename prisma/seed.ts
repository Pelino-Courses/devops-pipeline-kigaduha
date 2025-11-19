import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'bob.wilson@example.com',
      name: 'Bob Wilson',
    },
  });

  console.log('✅ Created users:', { user1, user2, user3 });

  // Create sample tasks for users
  const tasks = await prisma.task.createMany({
    data: [
      // Tasks for John Doe
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the DevOps pipeline project',
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2024-12-31'),
        userId: user1.id,
      },
      {
        title: 'Review code changes',
        description: 'Review pull requests from team members',
        status: 'in_progress',
        priority: 'medium',
        dueDate: new Date('2024-12-15'),
        userId: user1.id,
      },
      {
        title: 'Set up monitoring',
        description: 'Configure monitoring and alerting for production environment',
        status: 'completed',
        priority: 'high',
        userId: user1.id,
      },
      // Tasks for Jane Smith
      {
        title: 'Update CI/CD pipeline',
        description: 'Add automated testing to the GitHub Actions workflow',
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2024-12-20'),
        userId: user2.id,
      },
      {
        title: 'Database optimization',
        description: 'Optimize database queries and add indexes',
        status: 'in_progress',
        priority: 'medium',
        userId: user2.id,
      },
      {
        title: 'Security audit',
        description: 'Perform security audit of the application',
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2025-01-10'),
        userId: user2.id,
      },
      // Tasks for Bob Wilson
      {
        title: 'Deploy to staging',
        description: 'Deploy latest changes to staging environment',
        status: 'completed',
        priority: 'medium',
        userId: user3.id,
      },
      {
        title: 'Write unit tests',
        description: 'Add unit tests for new API endpoints',
        status: 'in_progress',
        priority: 'low',
        dueDate: new Date('2024-12-25'),
        userId: user3.id,
      },
    ],
  });

  console.log('✅ Created tasks:', tasks);

  // Fetch and display the created data
  const usersWithTasks = await prisma.user.findMany({
    include: {
      tasks: true,
    },
  });

  console.log('📊 Database seeded successfully!');
  console.log('Total users:', usersWithTasks.length);
  console.log('Total tasks:', usersWithTasks.reduce((sum, user) => sum + user.tasks.length, 0));
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
