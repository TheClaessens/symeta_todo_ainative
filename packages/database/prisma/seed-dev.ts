import { prisma } from '../src';

import { dump } from './utils/dump';
import { hash } from './utils/hash';

async function main() {
  await dump(prisma);
  await prisma.user.createMany({
    data: [
      {
        email: 'sw@faktion.com',
        password: await hash('password123'),
        firstName: 'SW',
        lastName: 'Faktion',
      },
      {
        email: 'ml@faktion.com',
        password: await hash('password123'),
        firstName: 'ML',
        lastName: 'Faktion',
      },
    ],
  });
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
