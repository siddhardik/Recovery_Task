const Task = require('../models/task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const createdBy = req.userData.userId; // Extracted from authMiddleware

    const task = new Task({ title, description, status, dueDate, createdBy });

    await task.save();

    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Task creation failed' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const createdBy = req.userData.userId; // Extracted from authMiddleware

    const tasks = await Task.find({ createdBy });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fetching tasks failed' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const createdBy = req.userData.userId; // Extracted from authMiddleware

    const task = await Task.findOne({ _id: id, createdBy });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fetching task failed' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const createdBy = req.userData.userId; // Extracted from authMiddleware

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, createdBy },
      { $set: req.body },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Task update failed' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const createdBy = req.userData.userId; // Extracted from authMiddleware

    const deletedTask = await Task.findOneAndDelete({ _id: id, createdBy });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Task deletion failed' });
  }
};
