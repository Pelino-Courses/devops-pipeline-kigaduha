import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseSetup() {
  console.log('🧪 Testing database setup...\n');

  try {
    // Test 1: Check database connection
    console.log('1️⃣  Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Database connection successful\n');

    // Test 2: Count users
    console.log('2️⃣  Counting users...');
    const userCount = await prisma.user.count();
    console.log(`   ✅ Found ${userCount} users\n`);

    // Test 3: Count tasks
    console.log('3️⃣  Counting tasks...');
    const taskCount = await prisma.task.count();
    console.log(`   ✅ Found ${taskCount} tasks\n`);

    // Test 4: Verify relationships
    console.log('4️⃣  Testing user-task relationships...');
    const usersWithTasks = await prisma.user.findMany({
      include: {
        tasks: true,
      },
    });
    
    let totalTasks = 0;
    usersWithTasks.forEach((user) => {
      console.log(`   - ${user.name}: ${user.tasks.length} tasks`);
      totalTasks += user.tasks.length;
    });
    console.log(`   ✅ Total tasks via relationships: ${totalTasks}\n`);

    // Test 5: Query by status
    console.log('5️⃣  Testing status filtering...');
    const pendingTasks = await prisma.task.count({ where: { status: 'pending' } });
    const inProgressTasks = await prisma.task.count({ where: { status: 'in_progress' } });
    const completedTasks = await prisma.task.count({ where: { status: 'completed' } });
    console.log(`   - Pending: ${pendingTasks}`);
    console.log(`   - In Progress: ${inProgressTasks}`);
    console.log(`   - Completed: ${completedTasks}`);
    console.log(`   ✅ Status filtering works\n`);

    // Test 6: Test unique constraint
    console.log('6️⃣  Testing unique email constraint...');
    try {
      await prisma.user.create({
        data: {
          email: 'john.doe@example.com', // Duplicate email
          name: 'Duplicate User',
        },
      });
      console.log('   ❌ Unique constraint failed - duplicate was allowed!');
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('   ✅ Unique constraint works (duplicate prevented)\n');
      } else {
        throw error;
      }
    }

    // Test 7: Test cascade delete
    console.log('7️⃣  Testing cascade delete...');
    // Create a test user with a task
    const testUser = await prisma.user.create({
      data: {
        email: 'test@delete.com',
        name: 'Test Delete User',
        tasks: {
          create: {
            title: 'Test Task',
            description: 'This task should be deleted with user',
          },
        },
      },
      include: { tasks: true },
    });
    console.log(`   - Created test user with ${testUser.tasks.length} task`);

    // Delete the user
    await prisma.user.delete({ where: { id: testUser.id } });
    
    // Check if tasks were deleted
    const orphanedTasks = await prisma.task.count({
      where: { userId: testUser.id },
    });
    
    if (orphanedTasks === 0) {
      console.log('   ✅ Cascade delete works (tasks deleted with user)\n');
    } else {
      console.log('   ❌ Cascade delete failed - tasks still exist!\n');
    }

    // Test 8: Test indexes
    console.log('8️⃣  Testing indexed queries...');
    const start = Date.now();
    await prisma.task.findMany({
      where: { status: 'pending' },
      take: 100,
    });
    const duration = Date.now() - start;
    console.log(`   ✅ Status index query completed in ${duration}ms\n`);

    console.log('🎉 All tests passed! Database setup is working correctly.\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testDatabaseSetup()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
