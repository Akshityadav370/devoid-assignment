import dotenv from 'dotenv';
import express from 'express';
import connectDb from './config/db.js';
import projectRouter from './routes/project.routes.js';
import taskRouter from './routes/task.routes.js';
import cors from 'cors';

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

app.listen(port, () => {
  connectDb();
  console.log(`*******Server started at ${port} ********`);
});
