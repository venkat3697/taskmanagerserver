const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Define routes for tasks
router.post('/createtask', taskController.createTask); // Create a new task
router.get('/gettasks/:id', taskController.getTasks); // Get all tasks
router.put('/update/:id', taskController.updateTask); // Update a task by ID
router.delete('/delete/:id', taskController.deleteTask); // Delete a task by ID

module.exports = router;
