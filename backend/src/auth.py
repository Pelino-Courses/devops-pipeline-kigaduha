import os
from datetime import datetime, timedelta
from functools import wraps

import bcrypt
import jwt
from flask import jsonify, request

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24


# In-memory user storage (replace with database in production)
users = {}
user_id_counter = 1


def hash_password(password):
    """Hash a password for storing."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password, hashed_password):
    """Verify a stored password against one provided by user."""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


# Initialize admin user
def initialize_admin():
    """Create default admin user if no users exist."""
    global user_id_counter
    if not users:
        admin_user = {
            "id": user_id_counter,
            "username": "admin",
            "email": "admin@taskmanager.com",
            "password": hash_password("admin123"),
            "role": "admin",
            "created_at": datetime.now().isoformat(),
        }
        users[user_id_counter] = admin_user
        user_id_counter += 1


# Initialize admin on module load
initialize_admin()


def generate_token(user_id, username, role="user"):
    """Generate JWT token for authenticated user."""
    payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_token(token):
    """Decode and verify JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def token_required(f):
    """Decorator to protect routes that require authentication."""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get token from Authorization header
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            try:
                token = auth_header.split(" ")[1]  # Format: "Bearer <token>"
            except IndexError:
                return jsonify({"error": "Invalid authorization header format"}), 401

        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401

        # Decode and verify token
        payload = decode_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Add user info to request context
        request.current_user = payload

        return f(*args, **kwargs)

    return decorated


def admin_required(f):
    """Decorator to protect routes that require admin access."""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get token from Authorization header
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            try:
                token = auth_header.split(" ")[1]  # Format: "Bearer <token>"
            except IndexError:
                return jsonify({"error": "Invalid authorization header format"}), 401

        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401

        # Decode and verify token
        payload = decode_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Check if user has admin role
        if payload.get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403

        # Add user info to request context
        request.current_user = payload

        return f(*args, **kwargs)

    return decorated


def create_user(username, email, password):
    """Create a new user."""
    global user_id_counter

    # Check if username or email already exists
    for user in users.values():
        if user["username"] == username:
            return None, "Username already exists"
        if user["email"] == email:
            return None, "Email already exists"

    # Create new user
    user_id = user_id_counter
    user_id_counter += 1

    user = {
        "id": user_id,
        "username": username,
        "email": email,
        "password": hash_password(password),
        "role": "user",
        "created_at": datetime.now().isoformat(),
    }

    users[user_id] = user

    # Return user without password
    safe_user = {k: v for k, v in user.items() if k != "password"}
    return safe_user, None


def authenticate_user(username, password):
    """Authenticate user with username and password."""
    # Find user by username
    user = None
    for u in users.values():
        if u["username"] == username:
            user = u
            break

    if not user:
        return None, "Invalid username or password"

    # Verify password
    if not verify_password(password, user["password"]):
        return None, "Invalid username or password"

    # Return user without password
    safe_user = {k: v for k, v in user.items() if k != "password"}
    return safe_user, None


def get_user_by_id(user_id):
    """Get user by ID."""
    user = users.get(user_id)
    if user:
        return {k: v for k, v in user.items() if k != "password"}
    return None
