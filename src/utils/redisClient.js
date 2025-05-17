import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

let isConnected = false;

const connectRedis = async () => {
  if (!isConnected) {
    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    try {
      await redisClient.connect();
      isConnected = true;
      console.log('Redis connected');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    
    }
  }
};

export default redisClient;
export { connectRedis };
