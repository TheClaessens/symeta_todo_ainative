import { prisma } from '../src';

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [],
  });
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
