import Project from '../models/project.model.js';

export const addProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newProject = await Project.create({ name, description });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error('add project', error);
    return res.status(500).json({ message: error });
  }
};

export const editProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { name, description } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message:
          'At least one field (name or description) must be provided for update.',
      });
    }

    const project = await Project.findByIdAndUpdate(projectId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res
        .status(400)
        .json({ message: 'The projectId is not found in DB!' });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error('edit project', error);
    return res.status(500).json({ message: error });
  }
};

export const readProjects = async (req, res) => {
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

    const projects = await Project.find()
      .skip(offsetNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const totalCount = await Project.countDocuments();

    return res.status(200).json({
      projects,
      pagination: {
        limit: limitNum,
        offset: offsetNum,
        total: totalCount,
        hasMore: offsetNum + limitNum < totalCount,
      },
    });
  } catch (error) {
    console.error('read projects', error);
    return res.status(500).json({ message: error });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const project = await Project.findByIdAndDelete(projectId);

    return res.status(200).json(project);
  } catch (error) {
    console.error('Delete Project', error);
    return res.status(500).json({ message: error });
  }
};
