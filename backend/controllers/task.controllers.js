import Task from '../models/task.model.js';

export const addTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const projectId = req.params.projectId;

    const newTask = await Task.create({
      title,
      description,
      status,
      project: projectId,
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('add Task', error);
    return res.status(500).json({ message: error });
  }
};

export const editTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { title, description, status } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message:
          'At least one field (title or description or status) must be provided for update.',
      });
    }

    const task = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res
        .status(400)
        .json({ message: 'The taskId is not found in DB!' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error('edit task', error);
    return res.status(500).json({ message: error });
  }
};

export const readTasks = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    if (isNaN(limitNum) || isNaN(offsetNum) || limitNum < 1 || offsetNum < 0) {
      return res.status(400).json({
        message:
          'Invalid limit or offset parameters. Limit must be >= 1, offset must be >= 0.',
      });
    }

    const tasks = await Task.find()
      .skip(offsetNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const totalCount = await Task.countDocuments();

    return res.status(200).json({
      tasks,
      pagination: {
        limit: limitNum,
        offset: offsetNum,
        total: totalCount,
        hasMore: offsetNum + limitNum < totalCount,
      },
    });
  } catch (error) {
    console.error('read tasks', error);
    return res.status(500).json({ message: error });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findByIdAndDelete(taskId);

    return res.status(200).json(task);
  } catch (error) {
    console.error('Delete Task', error);
    return res.status(500).json({ message: error });
  }
};
