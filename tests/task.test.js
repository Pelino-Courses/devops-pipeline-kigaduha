require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

describe('Task API', () => {
  let token;
  let userId;
  let testUser;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    // Clean up and close connection
    await Task.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear data before each test
    await Task.deleteMany({});
    await User.deleteMany({});

    // Create a test user
    testUser = await User.create({
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
    });

    userId = testUser._id;

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'password123',
      });

    token = loginRes.body.data.token;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'todo',
          priority: 'high',
          assignee: 'John Doe',
          labels: ['urgent', 'backend'],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Task');
      expect(res.body.data.description).toBe('Test Description');
      expect(res.body.data.status).toBe('todo');
      expect(res.body.data.priority).toBe('high');
      expect(res.body.data.assignee).toBe('John Doe');
      expect(res.body.data.labels).toEqual(['urgent', 'backend']);
    });

    it('should create task with minimal fields', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Minimal Task',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Minimal Task');
      expect(res.body.data.status).toBe('todo');
      expect(res.body.data.priority).toBe('medium');
    });

    it('should not create task without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Task without title',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should not create task without authentication', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Unauthorized Task',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks for authenticated user', async () => {
      // Create some test tasks
      await Task.create([
        {
          title: 'Task 1',
          description: 'First task',
          createdBy: userId,
        },
        {
          title: 'Task 2',
          description: 'Second task',
          status: 'in-progress',
          createdBy: userId,
        },
      ]);

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toHaveLength(2);
    });

    it('should not get tasks without authentication', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a single task by id', async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        createdBy: userId,
      });

      const res = await request(app)
        .get(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Task');
    });

    it('should not get task with invalid id', async () => {
      const res = await request(app)
        .get('/api/tasks/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should not get task without authentication', async () => {
      const task = await Task.create({
        title: 'Test Task',
        createdBy: userId,
      });

      const res = await request(app).get(`/api/tasks/${task._id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should update a task', async () => {
      const task = await Task.create({
        title: 'Original Task',
        description: 'Original Description',
        status: 'todo',
        createdBy: userId,
      });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task',
          status: 'in-progress',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Task');
      expect(res.body.data.status).toBe('in-progress');
    });

    it('should not update task with invalid id', async () => {
      const res = await request(app)
        .patch('/api/tasks/invalid-id')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task',
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should not update task without authentication', async () => {
      const task = await Task.create({
        title: 'Original Task',
        createdBy: userId,
      });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .send({
          title: 'Updated Task',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        createdBy: userId,
      });

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify task is deleted
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should not delete task with invalid id', async () => {
      const res = await request(app)
        .delete('/api/tasks/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should not delete task without authentication', async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        createdBy: userId,
      });

      const res = await request(app).delete(`/api/tasks/${task._id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
