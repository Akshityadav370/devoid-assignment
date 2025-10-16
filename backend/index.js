import dotenv from 'dotenv';
import express from 'express';
import connectDb from './config/db.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  connectDb();
  console.log(`*******Server started at ${port} ********`);
});
