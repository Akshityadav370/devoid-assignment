import Task from '../models/task.model.js';
import mongoose from 'mongoose';

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
    const { projectId, limit = 10, offset = 0, status } = req.query;

    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    if (isNaN(limitNum) || isNaN(offsetNum) || limitNum < 1 || offsetNum < 0) {
      return res.status(400).json({
        message:
          'Invalid limit or offset parameters. Limit must be >= 1, offset must be >= 0.',
      });
    }

    const baseQuery = {};
    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: 'Invalid projectId' });
      }
      baseQuery.project = projectId;
    }
    if (status && ['Todo', 'InProgress', 'Done'].includes(status)) {
      baseQuery.status = status;
    }

    const tasks = await Task.find(baseQuery)
      .populate('project', 'name description')
      .sort({ createdAt: -1 })
      .skip(offsetNum)
      .limit(limitNum);

    const totalCount = await Task.countDocuments(baseQuery);

    // Segregate tasks by status
    const segregatedTasks = {
      Todo: tasks.filter((task) => task.status === 'Todo'),
      InProgress: tasks.filter((task) => task.status === 'InProgress'),
      Done: tasks.filter((task) => task.status === 'Done'),
    };

    // Get counts for each status (from the entire dataset, not just paginated)
    const statusCounts = await Task.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {
      Todo: 0,
      InProgress: 0,
      Done: 0,
      Total: totalCount,
    };

    statusCounts.forEach((item) => {
      counts[item._id] = item.count;
    });

    return res.status(200).json({
      tasks: segregatedTasks,
      counts,
      pagination: {
        limit: limitNum,
        offset: offsetNum,
        total: totalCount,
        hasMore: offsetNum + limitNum < totalCount,
      },
      ...(projectId && { projectId }),
      ...(status && { status }),
    });
  } catch (error) {
    console.error('read tasks', error);
    return res.status(500).json({ message: error.message });
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
