const express = require('express');
const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/Taskcontroller');
const { authenticate } = require('../middleware/authMiddleware');



// GET all tasks
router.get('/', authenticate, getTasks);

// CREATE new task
router.post('/', authenticate, createTask);

// UPDATE task
router.put('/:id', authenticate, updateTask);

// DELETE task
router.delete('/:id', authenticate, deleteTask);

module.exports = router;