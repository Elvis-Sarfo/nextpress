/**
 * Test: Generate Prisma schema from Users collection
 */

import { generatePrismaSchema } from './index';
import { Users } from '../../collections/Users';

// Generate schema for Users collection
const schema = generatePrismaSchema([Users], {
  provider: 'postgresql',
  localization: true,
  versioning: true,
});

console.log(schema);
