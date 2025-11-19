require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

describe('Task API', () => {
  let token;
  let userId;

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

    // Create and login a test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    userId = user._id;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
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
    beforeEach(async () => {
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
    });

    it('should get all tasks for authenticated user', async () => {
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
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        createdBy: userId,
      });
      taskId = task._id;
    });

    it('should get a single task by id', async () => {
      const res = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Task');
    });

    it('should not get task with invalid id', async () => {
      const res = await request(app)
        .get('/api/tasks/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });

    it('should not get task without authentication', async () => {
      const res = await request(app).get(`/api/tasks/${taskId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Original Task',
        description: 'Original Description',
        status: 'todo',
        createdBy: userId,
      });
      taskId = task._id;
    });

    it('should update a task', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
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

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });

    it('should not update task without authentication', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({
          title: 'Updated Task',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        createdBy: userId,
      });
      taskId = task._id;
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify task is deleted
      const task = await Task.findById(taskId);
      expect(task).toBeNull();
    });

    it('should not delete task with invalid id', async () => {
      const res = await request(app)
        .delete('/api/tasks/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });

    it('should not delete task without authentication', async () => {
      const res = await request(app).delete(`/api/tasks/${taskId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
