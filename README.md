# devops-pipeline-kigaduha

End-to-End DevOps Pipeline Implementation - Task Management REST API

## 📋 Overview

A fully functional REST API for task management with JWT authentication, built with Express.js and MongoDB. This project demonstrates modern DevOps practices including containerization, CI/CD, API documentation, and comprehensive testing.

## 🚀 Features

- **JWT Authentication**: Secure user registration and login
- **Task CRUD Operations**: Complete task management (Create, Read, Update, Delete)
- **Task Fields**: Title, description, status, priority, due date, assignee, labels
- **API Documentation**: Interactive Swagger/OpenAPI docs
- **Docker Support**: Full containerization with docker-compose
- **Automated Testing**: Comprehensive Jest test suite
- **Code Quality**: ESLint with Airbnb style guide
- **CI/CD**: GitHub Actions workflows for automated testing and linting

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, bcryptjs, CORS
- **Validation**: express-validator
- **Testing**: Jest, Supertest
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Code Quality**: ESLint (Airbnb config)
- **DevOps**: Docker, docker-compose, GitHub Actions

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Docker)
- Docker and docker-compose (optional)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/dukuzejean09/devops-pipeline-kigaduha.git
cd devops-pipeline-kigaduha
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/devops-pipeline
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
```

5. Start MongoDB (if running locally):
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

6. Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Docker Development

1. Start all services with docker-compose:
```bash
docker-compose up -d
```

2. View logs:
```bash
docker-compose logs -f api
```

3. Stop services:
```bash
docker-compose down
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all user tasks | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| PATCH | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### API Documentation

Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:3000/api-docs`

### Example Requests

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Create Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete API documentation",
    "description": "Add comprehensive API docs",
    "status": "todo",
    "priority": "high",
    "dueDate": "2024-12-31",
    "assignee": "John Doe",
    "labels": ["documentation", "urgent"]
  }'
```

#### Get All Tasks
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Tests include:
- Authentication (register, login, protected routes)
- Task CRUD operations
- Input validation
- Authorization checks
- Error handling

## 🔍 Code Quality

Run ESLint:
```bash
npm run lint
```

Fix ESLint issues automatically:
```bash
npm run lint:fix
```

## 🏗️ Project Structure

```
devops-pipeline-kigaduha/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # MongoDB connection
│   │   └── swagger.js   # Swagger configuration
│   ├── controllers/     # Request handlers
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js      # JWT authentication
│   │   └── errorHandler.js
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/           # Utility functions
│   │   └── jwt.js
│   ├── app.js           # Express app setup
│   └── index.js         # Server entry point
├── tests/               # Test files
│   ├── setup.js
│   ├── auth.test.js
│   └── task.test.js
├── .github/
│   └── workflows/       # GitHub Actions
│       ├── lint-test.yml
│       └── project-automation.yml
├── docker-compose.yml   # Docker compose config
├── Dockerfile           # Docker image config
├── .eslintrc.js         # ESLint configuration
├── jest.config.js       # Jest configuration
├── package.json         # Dependencies and scripts
└── README.md            # Documentation
```

## 🚢 Deployment

### Environment Variables for Production

Ensure these environment variables are set in production:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-strong-secret-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Production Build

Build production image:
```bash
docker build -t devops-api:latest .
```

Run production container:
```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-secret \
  --name devops-api \
  devops-api:latest
```

## 🔒 Security

- Passwords are hashed using bcryptjs
- JWT tokens for stateless authentication
- Helmet.js for HTTP security headers
- CORS configuration
- Input validation with express-validator
- MongoDB injection protection via Mongoose

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jean Dukuze**

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the database
- All open-source contributors

