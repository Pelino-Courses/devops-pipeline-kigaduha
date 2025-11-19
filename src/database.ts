import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Example: Get all users with their tasks
 */
export async function getAllUsersWithTasks() {
  const users = await prisma.user.findMany({
    include: {
      tasks: true,
    },
  });
  return users;
}

/**
 * Example: Create a new user
 */
export async function createUser(email: string, name: string) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });
  return user;
}

/**
 * Example: Create a task for a user
 */
export async function createTask(
  userId: number,
  title: string,
  description?: string,
  priority: string = 'medium',
  dueDate?: Date
) {
  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate,
      userId,
    },
  });
  return task;
}

/**
 * Example: Get tasks by status
 */
export async function getTasksByStatus(status: string) {
  const tasks = await prisma.task.findMany({
    where: {
      status,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return tasks;
}

/**
 * Example: Update task status
 */
export async function updateTaskStatus(taskId: number, status: string) {
  const task = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
    },
  });
  return task;
}

/**
 * Example: Delete a task
 */
export async function deleteTask(taskId: number) {
  const task = await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
  return task;
}

/**
 * Example: Get user by email
 */
export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      tasks: true,
    },
  });
  return user;
}

/**
 * Example: Get tasks due before a certain date
 */
export async function getTasksDueBefore(date: Date) {
  const tasks = await prisma.task.findMany({
    where: {
      dueDate: {
        lte: date,
      },
      status: {
        not: 'completed',
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      dueDate: 'asc',
    },
  });
  return tasks;
}

/**
 * Example: Get task statistics for a user
 */
export async function getUserTaskStats(userId: number) {
  const [total, completed, pending, inProgress] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: 'completed' } }),
    prisma.task.count({ where: { userId, status: 'pending' } }),
    prisma.task.count({ where: { userId, status: 'in_progress' } }),
  ]);

  return {
    total,
    completed,
    pending,
    inProgress,
  };
}

// Clean up function to disconnect Prisma Client
export async function disconnect() {
  await prisma.$disconnect();
}

// Example usage (uncomment to run)
// async function main() {
//   try {
//     // Get all users with tasks
//     const users = await getAllUsersWithTasks();
//     console.log('Users:', JSON.stringify(users, null, 2));
//
//     // Get pending tasks
//     const pendingTasks = await getTasksByStatus('pending');
//     console.log('Pending tasks:', pendingTasks.length);
//
//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     await disconnect();
//   }
// }
//
// main();
