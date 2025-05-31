import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async() => {
  try {
    await prisma.$connect();
    // eslint-disable-next-line
    console.log('Database connected successfully');
    return prisma;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Disconnect function for graceful shutdown
export const disconnectDB = async() => {
  try {
    await prisma.$disconnect();
    // eslint-disable-next-line
    console.log('Database disconnected successfully');
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error disconnecting from database:', error);
    process.exit(1);
  }
};
export default prisma;
