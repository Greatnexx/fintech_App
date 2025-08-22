import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import redisClient, { connectRedis } from './utils/redisClient.js';
import  routers  from './routes/index.js';
// eslint-disable-next-line
import prisma, { connectDB, disconnectDB } from "./prisma/client.js";
import { handlePaystackWebhook } from './controllers/Transactions/webhook.js';

dotenv.config();

// Connect to databases
connectRedis();
connectDB();

const port = process.env.APP_PORT || 4000;

const app = express();

// This tells Express: “accept raw JSON from paystack and forward it to handlePaystackWebhook.”
app.post(
  '/api/v1/paystack/webhook',
  express.raw({ type: 'application/json' }),
  handlePaystackWebhook,
);

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/test', async(_req, res) => {
  return res.status(200).send('Welcome to client-project-management!');
});

app.use('/api/v1', routers);

app.use(notFound);
app.use(errorHandler);

const gracefulShutdown = async() => {
  // eslint-disable-next-line
  console.log("Closing database and Redis connections...");
  await disconnectDB();
  await redisClient.quit();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

app.listen(port, () =>
  // eslint-disable-next-line
  console.log(
    `server is running on port ${port} in ${process.env.NODE_ENV} mode`,
  ),
);
