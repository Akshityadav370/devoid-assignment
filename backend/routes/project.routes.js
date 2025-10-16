import express from 'express';
import {
  addProject,
  deleteProject,
  editProject,
  readProjects,
} from '../controllers/project.controllers.js';

const projectRouter = express.Router();

projectRouter.post('/add-project', addProject);
projectRouter.patch('/update-project/:projectId', editProject);
projectRouter.get('/read-projects', readProjects);
projectRouter.delete('/delete-project/:projectId', deleteProject);

export default projectRouter;
