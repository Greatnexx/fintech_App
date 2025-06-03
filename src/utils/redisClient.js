import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

let isConnected = false;

const connectRedis = async() => {
  if (!isConnected) {
    redisClient.on('error', (err) =>
      // eslint-disable-next-line
      console.error('Redis Client Error:', err));
    try {
      await redisClient.connect();
      isConnected = true;
      // eslint-disable-next-line
      console.log('Redis connected');
    } catch (err) {
      // eslint-disable-next-line
      console.error('Failed to connect to Redis:', err);

    }
  }
};

export default redisClient;
export { connectRedis };
