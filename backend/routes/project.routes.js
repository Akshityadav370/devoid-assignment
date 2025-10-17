import express from 'express';
import {
  addProject,
  deleteProject,
  editProject,
  readProjectById,
  readProjects,
} from '../controllers/project.controllers.js';

const projectRouter = express.Router();

projectRouter.post('/add-project', addProject);
projectRouter.put('/update-project/:projectId', editProject);
projectRouter.get('/read-projects', readProjects);
projectRouter.get('/read-project-by-id/:projectId', readProjectById);
projectRouter.delete('/delete-project/:projectId', deleteProject);

export default projectRouter;
