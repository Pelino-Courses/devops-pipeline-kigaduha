import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function AdminDashboard() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/v1/admin/users`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError('Failed to load users: ' + err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async userId => {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/users/${userId}/stats`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      const data = await response.json();
      setSelectedUser(data);
    } catch (err) {
      setError('Failed to load user stats: ' + err.message);
      console.error('Error fetching user stats:', err);
    }
  };

  const handleDeleteUser = async userId => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) {
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete user "${userToDelete.username}"? This will also delete all their tasks.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setUsers(users.filter(u => u.id !== userId));
      setSelectedUser(null);
      setError(null);
    } catch (err) {
      setError('Failed to delete user: ' + err.message);
      console.error('Error deleting user:', err);
    }
  };

  const getRoleBadgeClass = role => {
    return role === 'admin' ? 'role-badge admin' : 'role-badge user';
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>👑 Admin Dashboard</h1>
        <p>Manage users and view system statistics</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        <div className="users-section">
          <h2>All Users ({users.length})</h2>

          {loading ? (
            <p className="loading">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="no-data">No users found</p>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className={u.id === user.id ? 'current-user' : ''}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={getRoleBadgeClass(u.role)}>{u.role}</span>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="actions">
                        <button
                          onClick={() => fetchUserStats(u.id)}
                          className="btn-view"
                          title="View Stats"
                        >
                          📊 Stats
                        </button>
                        {u.id !== user.id && u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="btn-delete-user"
                            title="Delete User"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="user-stats-panel">
            <div className="panel-header">
              <h2>User Statistics</h2>
              <button onClick={() => setSelectedUser(null)} className="btn-close">
                ✕
              </button>
            </div>

            <div className="stats-content">
              <div className="user-info">
                <h3>{selectedUser.user.username}</h3>
                <p className="user-email">{selectedUser.user.email}</p>
                <span className={getRoleBadgeClass(selectedUser.user.role)}>
                  {selectedUser.user.role}
                </span>
              </div>

              <div className="task-stats">
                <h4>Task Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{selectedUser.total_tasks}</span>
                    <span className="stat-label">Total Tasks</span>
                  </div>
                  <div className="stat-item pending">
                    <span className="stat-value">{selectedUser.pending}</span>
                    <span className="stat-label">Pending</span>
                  </div>
                  <div className="stat-item in-progress">
                    <span className="stat-value">{selectedUser.in_progress}</span>
                    <span className="stat-label">In Progress</span>
                  </div>
                  <div className="stat-item completed">
                    <span className="stat-value">{selectedUser.completed}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
