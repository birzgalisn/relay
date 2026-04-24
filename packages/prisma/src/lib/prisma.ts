import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../_generated/prisma/client';
import { DATABASE_URL } from './constants';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };
