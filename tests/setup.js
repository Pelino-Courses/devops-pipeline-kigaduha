// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 3001;
process.env.MONGODB_URI = 'mongodb://localhost:27017/devops-pipeline-test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CORS_ORIGIN = '*';
