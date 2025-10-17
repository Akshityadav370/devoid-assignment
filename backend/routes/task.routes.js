import express from 'express';
import {
  addTask,
  deleteTask,
  editTask,
  readTasks,
} from '../controllers/task.controllers.js';

const taskRouter = express.Router();

taskRouter.post('/add-task/:projectId', addTask);
taskRouter.put('/update-task/:taskId', editTask);
taskRouter.get('/read-tasks', readTasks);
taskRouter.delete('/delete-task/:taskId', deleteTask);

export default taskRouter;
