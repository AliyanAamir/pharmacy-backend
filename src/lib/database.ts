import { PrismaClient } from '@prisma/client';
import logger from './logger.service';

const db = new PrismaClient();

export const connectDatabase = async () => {
  try {
    logger.info('Connecting database...');
    await db.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.error((err as Error).message);
    process.exit(1);
  }
};

export default db;
