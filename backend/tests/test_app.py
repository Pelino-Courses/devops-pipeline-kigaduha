"""
Tests for the task management API
"""

import json

import pytest

from src.app import app


@pytest.fixture
def client():
    """Create test client"""
    app.config["TESTING"] = True
    # Clear users dict and reset counter before each test
    from src import auth

    auth.users.clear()
    auth.user_id_counter = 1  # Reset counter
    auth.initialize_admin()  # Re-initialize admin user with ID 1
    with app.test_client() as client:
        yield client


@pytest.fixture
def auth_headers(client):
    """Create authentication headers with valid token"""
    # Register a test user (ignore if it already exists)
    client.post(
        "/api/v1/auth/register",
        data=json.dumps({"username": "testuser", "email": "test@test.com", "password": "testpass123"}),
        content_type="application/json",
    )

    # If registration fails (user exists), that's ok - continue to login
    login_response = client.post(
        "/api/v1/auth/login",
        data=json.dumps({"username": "testuser", "password": "testpass123"}),
        content_type="application/json",
    )

    login_data = login_response.get_json()
    assert login_response.status_code == 200, f"Login failed: {login_data}"
    assert "token" in login_data, f"No token in response: {login_data}"

    token = login_data["token"]
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def test_index(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Task Management API with Authentication"
    assert data["status"] == "running"


def test_health(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"
    assert data["service"] == "task-management-api"


def test_get_tasks(client, auth_headers):
    """Test getting all tasks"""
    response = client.get("/api/v1/tasks", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "tasks" in data
    assert "total" in data


def test_create_task(client, auth_headers):
    """Test creating a new task"""
    task_data = {"title": "Test Task", "description": "This is a test task", "priority": "high"}
    response = client.post("/api/v1/tasks", data=json.dumps(task_data), headers=auth_headers)
    assert response.status_code == 201
    data = response.get_json()
    assert data["title"] == "Test Task"
    assert data["priority"] == "high"


def test_create_task_without_title(client, auth_headers):
    """Test creating a task without title"""
    task_data = {"description": "This task has no title"}
    response = client.post("/api/v1/tasks", data=json.dumps(task_data), headers=auth_headers)
    assert response.status_code == 400


def test_get_single_task(client, auth_headers):
    """Test getting a specific task"""
    # First create a task to get
    task_data = {"title": "Task to Get", "description": "Test task"}
    create_response = client.post("/api/v1/tasks", data=json.dumps(task_data), headers=auth_headers)
    task_id = create_response.get_json()["id"]

    response = client.get(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "id" in data
    assert "title" in data


def test_get_nonexistent_task(client, auth_headers):
    """Test getting a task that doesn't exist"""
    response = client.get("/api/v1/tasks/99999", headers=auth_headers)
    assert response.status_code == 404


def test_update_task(client, auth_headers):
    """Test updating a task"""
    # First create a task
    task_data = {"title": "Task to Update", "description": "Test task"}
    create_response = client.post("/api/v1/tasks", data=json.dumps(task_data), headers=auth_headers)
    task_id = create_response.get_json()["id"]

    update_data = {"status": "completed"}
    response = client.put(f"/api/v1/tasks/{task_id}", data=json.dumps(update_data), headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "completed"


def test_delete_task(client, auth_headers):
    """Test deleting a task"""
    # First create a task
    task_data = {"title": "Task to delete"}
    create_response = client.post("/api/v1/tasks", data=json.dumps(task_data), headers=auth_headers)
    task_id = create_response.get_json()["id"]

    # Then delete it
    response = client.delete(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 200

    # Verify it's deleted
    get_response = client.get(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert get_response.status_code == 404


def test_get_stats(client, auth_headers):
    """Test getting task statistics"""
    response = client.get("/api/v1/tasks/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "total" in data
    assert "pending" in data
    assert "in_progress" in data
    assert "completed" in data
    assert "by_priority" in data
