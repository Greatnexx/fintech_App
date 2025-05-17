import express from "express";
import cors from "cors";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import dotenv from "dotenv";
import redisClient, { connectRedis } from "./utils/redisClient.js";
import { userRoutes } from "./routes/index.js";
dotenv.config();
connectRedis();

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.get("/test", async (_req, res) => {
  return res.status(200).send("Welcome to client-project-management!");
});

app.use('/api/v1', userRoutes)

app.use(notFound);
app.use(errorHandler);

const gracefulShutdown = async () => {
  console.log("Closing Redis connection...");
  await redisClient.quit();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

app.listen(port, () =>
  console.log(
    `server is running on port ${port} in ${process.env.NODE_ENV} mode`
  )
);
