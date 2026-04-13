const mongoose = require('mongoose');
const Task = require('../models/Taskmodel');

// Demo in-memory store
const demoTasks = [];
const isDemoUser = (req) => req.user && req.user.id === 'demo';

const normalizeStatus = (status) => {
  const value = String(status || '').trim().toLowerCase();
  if (!value) return 'Pending';
  const map = {
    todo: 'Pending',
    pending: 'Pending',
    'in progress': 'In Progress',
    completed: 'Completed',
    overdue: 'Overdue',
  };
  return map[value] || 'Pending';
};

const normalizePriority = (priority) => {
  const value = String(priority || '').trim().toLowerCase();
  const map = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };
  return map[value] || 'Medium';
};

// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
  return res.status(401).json({ error: 'Unauthorized user' });
}
    if (isDemoUser(req)) {
      let results = [...demoTasks];
      const { search, status, priority, category } = req.query;

      if (search) {
        const s = search.toLowerCase();
        results = results.filter(
          (x) =>
            x.title.toLowerCase().includes(s) ||
            (x.description || '').toLowerCase().includes(s)
        );
      }

      if (status) results = results.filter((x) => x.status === normalizeStatus(status));
      if (priority) results = results.filter((x) => x.priority === normalizePriority(priority));
      if (category) results = results.filter((x) => x.category === category);

      return res.json(results);
    }

    const query = { userId: req.user.id };
    const { search, status, priority, category } = req.query;

    if (status) query.status = normalizeStatus(status);
    if (priority) query.priority = normalizePriority(priority);
    if (category) query.category = category;

    let tasks = await Task.find(query).sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      tasks = tasks.filter(
        (x) =>
          x.title.toLowerCase().includes(s) ||
          (x.description || '').toLowerCase().includes(s)
      );
    }

    res.json(tasks.map((t) => t.toJSON()));
  } catch (err) {
    console.error('getTasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized user' });
    }

    const { title, description, assignedTo, category, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const taskData = {
      title: title.trim(),
      description: description || '',
      assignedTo: assignedTo || '',
      category: category || 'General',
      status: normalizeStatus(status),
      priority: normalizePriority(priority),
      dueDate: dueDate || null,
    };

    if (isDemoUser(req)) {
      const demoTask = {
        id: `demo-${Date.now()}`,
        userId: 'demo',
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoTasks.unshift(demoTask);
      return res.status(201).json(demoTask);
    }

    // ✅ DEBUG LOG
    console.log("Creating task for user:", req.user);

    const task = await Task.create({
      userId: req.user.id,
      ...taskData,
    });

    res.status(201).json(task.toJSON());
  } catch (err) {
    console.error('createTask error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, category, status, priority, dueDate } = req.body;

    const updateData = {
      title: (title || '').trim() || 'Untitled Task',
      description: description || '',
      assignedTo: assignedTo || '',
      category: category || 'General',
      status: normalizeStatus(status),
      priority: normalizePriority(priority),
      dueDate: dueDate || null,
    };

    if (isDemoUser(req)) {
      const idx = demoTasks.findIndex((t) => t.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Task not found' });

      demoTasks[idx] = {
        ...demoTasks[idx],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      return res.json(demoTasks[idx]);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updated = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Task not found' });

    res.json(updated.toJSON());
  } catch (err) {
    console.error('updateTask error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDemoUser(req)) {
      const idx = demoTasks.findIndex((t) => t.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Task not found' });

      demoTasks.splice(idx, 1);
      return res.json({ message: 'Task deleted successfully' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleted = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('deleteTask error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };