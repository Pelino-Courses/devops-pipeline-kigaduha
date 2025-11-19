import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const url =
        filter === 'all' ? `${API_URL}/api/v1/tasks` : `${API_URL}/api/v1/tasks?status=${filter}`;

      const response = await fetch(url);
      const data = await response.json();
      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure the backend is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/tasks/stats`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCreateTask = async e => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setNewTask({ title: '', description: '', priority: 'medium' });
        fetchTasks();
        fetchStats();
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks();
        fetchStats();
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleEditTask = async e => {
    e.preventDefault();
    if (!editingTask.title.trim()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          status: editingTask.status,
        }),
      });

      if (response.ok) {
        setEditingTask(null);
        fetchTasks();
        fetchStats();
      } else {
        const errorData = await response.json();
        setError(`Failed to update task: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async taskId => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks();
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#3b82f6';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📋 Task Management App</h1>
        <p>Organize your work efficiently</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-container">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card pending">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card in-progress">
          <h3>{stats.in_progress}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card completed">
          <h3>{stats.completed}</h3>
          <p>Completed</p>
        </div>
      </div>

      <main className="content">
        <div className="task-form-container">
          <h2>Create New Task</h2>
          <form onSubmit={handleCreateTask} className="task-form">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Task description..."
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              rows="3"
            />
            <select
              value={newTask.priority}
              onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button type="submit" className="btn-primary">
              Add Task
            </button>
          </form>
        </div>

        <div className="tasks-section">
          <div className="filter-buttons">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
              All
            </button>
            <button
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={filter === 'in-progress' ? 'active' : ''}
              onClick={() => setFilter('in-progress')}
            >
              In Progress
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          {loading ? (
            <p className="loading">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="no-tasks">No tasks found. Create your first task above!</p>
          ) : (
            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {task.description && <p className="task-description">{task.description}</p>}

                  <div className="task-footer">
                    <select
                      value={task.status}
                      onChange={e => handleUpdateStatus(task.id, e.target.value)}
                      style={{
                        borderColor: getStatusColor(task.status),
                        color: getStatusColor(task.status),
                      }}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button onClick={() => setEditingTask(task)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="btn-delete">
                      Delete
                    </button>
                  </div>

                  <div className="task-meta">
                    <small>Created: {new Date(task.created_at).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Edit Task</h2>
            <form onSubmit={handleEditTask} className="task-form">
              <input
                type="text"
                placeholder="Task title..."
                value={editingTask.title}
                onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Task description..."
                value={editingTask.description}
                onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                rows="3"
              />
              <select
                value={editingTask.priority}
                onChange={e => setEditingTask({ ...editingTask, priority: e.target.value })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <select
                value={editingTask.status}
                onChange={e => setEditingTask({ ...editingTask, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingTask(null)} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
