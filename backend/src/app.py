import os
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS

from src.auth import (
    admin_required,
    authenticate_user,
    create_user,
    generate_token,
    get_user_by_id,
    token_required,
    users,
)

app = Flask(__name__)
CORS(app)

# Configuration
app.config["DEBUG"] = os.getenv("DEBUG", "False") == "True"
app.config["ENV"] = os.getenv("ENVIRONMENT", "production")

# In-memory task storage (replace with database in production)
tasks = []
next_id = 1


@app.route("/")
def index():
    """Root endpoint"""
    return jsonify(
        {
            "message": "Task Management API with Authentication",
            "status": "running",
            "version": "2.0.0",
            "endpoints": {
                "health": "/health",
                "register": "POST /api/v1/auth/register",
                "login": "POST /api/v1/auth/login",
                "me": "GET /api/v1/auth/me",
                "tasks": "/api/v1/tasks",
                "create_task": "POST /api/v1/tasks",
                "get_task": "GET /api/v1/tasks/<id>",
                "update_task": "PUT /api/v1/tasks/<id>",
                "delete_task": "DELETE /api/v1/tasks/<id>",
            },
        }
    )


@app.route("/health")
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "task-management-api", "tasks_count": len(tasks)}), 200


# ============= Authentication Routes =============


@app.route("/api/v1/auth/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Validate input
    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    # Create user
    user, error = create_user(username, email, password)

    if error:
        return jsonify({"error": error}), 400

    # Generate token
    token = generate_token(user["id"], user["username"], user.get("role", "user"))

    return (
        jsonify(
            {
                "message": "User registered successfully",
                "user": user,
                "token": token,
            }
        ),
        201,
    )


@app.route("/api/v1/auth/login", methods=["POST"])
def login():
    """Login user"""
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Authenticate user
    user, error = authenticate_user(username, password)

    if error:
        return jsonify({"error": error}), 401

    # Generate token
    token = generate_token(user["id"], user["username"], user.get("role", "user"))

    return jsonify({"message": "Login successful", "user": user, "token": token}), 200


@app.route("/api/v1/auth/me", methods=["GET"])
@token_required
def get_current_user():
    """Get current authenticated user"""
    user = get_user_by_id(request.current_user["user_id"])

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user), 200


# ============= Admin Routes =============


@app.route("/api/v1/admin/users", methods=["GET"])
@admin_required
def get_all_users():
    """Get all users (admin only)"""
    all_users = []
    for user in users.values():
        safe_user = {k: v for k, v in user.items() if k != "password"}
        all_users.append(safe_user)

    return jsonify({"users": all_users, "total": len(all_users)}), 200


@app.route("/api/v1/admin/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    """Delete a user (admin only)"""
    global tasks

    # Prevent admin from deleting themselves
    if user_id == request.current_user["user_id"]:
        return jsonify({"error": "Cannot delete your own admin account"}), 400

    # Check if user exists
    if user_id not in users:
        return jsonify({"error": "User not found"}), 404

    # Prevent deleting the only admin
    user_to_delete = users[user_id]
    if user_to_delete.get("role") == "admin":
        admin_count = sum(1 for u in users.values() if u.get("role") == "admin")
        if admin_count <= 1:
            return jsonify({"error": "Cannot delete the only admin user"}), 400

    # Delete user's tasks
    tasks = [t for t in tasks if t.get("user_id") != user_id]

    # Delete user
    deleted_user = users.pop(user_id)
    username = deleted_user.get("username", "unknown")

    return (
        jsonify(
            {
                "message": f"User {username} deleted successfully",
                "deleted_user_id": user_id,
            }
        ),
        200,
    )


@app.route("/api/v1/admin/users/<int:user_id>/stats", methods=["GET"])
@admin_required
def get_user_stats(user_id):
    """Get statistics for a specific user (admin only)"""
    if user_id not in users:
        return jsonify({"error": "User not found"}), 404

    user = get_user_by_id(user_id)
    user_tasks = [t for t in tasks if t.get("user_id") == user_id]

    stats = {
        "user": user,
        "total_tasks": len(user_tasks),
        "pending": len([t for t in user_tasks if t["status"] == "pending"]),
        "in_progress": len([t for t in user_tasks if t["status"] == "in-progress"]),
        "completed": len([t for t in user_tasks if t["status"] == "completed"]),
    }

    return jsonify(stats), 200


# ============= Task Routes (Protected) =============


@app.route("/api/v1/tasks", methods=["GET"])
@token_required
def get_tasks():
    """Get all tasks for the current user"""
    user_id = request.current_user["user_id"]
    status_filter = request.args.get("status")
    priority_filter = request.args.get("priority")

    # Filter tasks by user
    filtered_tasks = [t for t in tasks if t["user_id"] == user_id]

    if status_filter:
        filtered_tasks = [t for t in filtered_tasks if t["status"] == status_filter]

    if priority_filter:
        filtered_tasks = [t for t in filtered_tasks if t["priority"] == priority_filter]

    return jsonify({"tasks": filtered_tasks, "total": len(filtered_tasks)}), 200


@app.route("/api/v1/tasks/<int:task_id>", methods=["GET"])
@token_required
def get_task(task_id):
    """Get a specific task"""
    user_id = request.current_user["user_id"]
    task = next((t for t in tasks if t["id"] == task_id and t["user_id"] == user_id), None)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    return jsonify(task), 200


@app.route("/api/v1/tasks", methods=["POST"])
@token_required
def create_task():
    """Create a new task"""
    global next_id

    user_id = request.current_user["user_id"]
    data = request.get_json()

    if not data or "title" not in data:
        return jsonify({"error": "Title is required"}), 400

    new_task = {
        "id": next_id,
        "user_id": user_id,
        "title": data["title"],
        "description": data.get("description", ""),
        "status": data.get("status", "pending"),
        "priority": data.get("priority", "medium"),
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

    tasks.append(new_task)
    next_id += 1

    return jsonify(new_task), 201


@app.route("/api/v1/tasks/<int:task_id>", methods=["PUT"])
@token_required
def update_task(task_id):
    """Update an existing task"""
    user_id = request.current_user["user_id"]
    task = next((t for t in tasks if t["id"] == task_id and t["user_id"] == user_id), None)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()

    if "title" in data:
        task["title"] = data["title"]
    if "description" in data:
        task["description"] = data["description"]
    if "status" in data:
        task["status"] = data["status"]
    if "priority" in data:
        task["priority"] = data["priority"]

    task["updated_at"] = datetime.now().isoformat()

    return jsonify(task), 200


@app.route("/api/v1/tasks/<int:task_id>", methods=["DELETE"])
@token_required
def delete_task(task_id):
    """Delete a task"""
    global tasks

    user_id = request.current_user["user_id"]
    task = next((t for t in tasks if t["id"] == task_id and t["user_id"] == user_id), None)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    tasks = [t for t in tasks if t["id"] != task_id]

    return jsonify({"message": "Task deleted successfully"}), 200


@app.route("/api/v1/tasks/stats", methods=["GET"])
@token_required
def get_stats():
    """Get task statistics for current user"""
    user_id = request.current_user["user_id"]
    user_tasks = [t for t in tasks if t["user_id"] == user_id]

    total = len(user_tasks)
    pending = len([t for t in user_tasks if t["status"] == "pending"])
    in_progress = len([t for t in user_tasks if t["status"] == "in-progress"])
    completed = len([t for t in user_tasks if t["status"] == "completed"])

    return (
        jsonify(
            {
                "total": total,
                "pending": pending,
                "in_progress": in_progress,
                "completed": completed,
                "by_priority": {
                    "high": len([t for t in user_tasks if t["priority"] == "high"]),
                    "medium": len([t for t in user_tasks if t["priority"] == "medium"]),
                    "low": len([t for t in user_tasks if t["priority"] == "low"]),
                },
            }
        ),
        200,
    )


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
