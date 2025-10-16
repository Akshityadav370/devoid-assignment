import dotenv from 'dotenv';
import express from 'express';
import connectDb from './config/db.js';
import projectRouter from './routes/project.routes.js';
import taskRouter from './routes/task.routes.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

app.use('api/project', projectRouter);
app.use('api/task', taskRouter);

app.listen(port, () => {
  connectDb();
  console.log(`*******Server started at ${port} ********`);
});
