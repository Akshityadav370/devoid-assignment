import dotenv from 'dotenv';
import express from 'express';
import connectDb from './config/db.js';
import projectRouter from './routes/project.routes.js';
import taskRouter from './routes/task.routes.js';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: 'https://project-manager-devoid.netlify.app',
    credentials: true,
  })
);

app.use(express.json());

connectDb().catch(console.error);

app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database:
      mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

app.listen(port, () => {
  //   connectDb();
  console.log(`*******Server started at ${port} ********`);
});
