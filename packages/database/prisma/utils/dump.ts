import { PrismaClient } from '@prisma/client/extension';

/* This will drop all data + it's tables */
export const dump = async (prisma: PrismaClient) => {
  const tableNames = (await prisma.$queryRawUnsafe(
    `SELECT tablename
     FROM pg_tables
     WHERE schemaname = 'public'`
  )) as unknown as Array<{ tablename: string }>;

  for (const { tablename } of tableNames) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$queryRawUnsafe(
        // eslint-disable-next-line no-useless-escape
        `TRUNCATE TABLE \"public\".\"${tablename}\" CASCADE;`
      );
    }
  }

  const relNames = (await prisma.$queryRawUnsafe(
    `SELECT c.relname
     FROM pg_class AS c
            JOIN pg_namespace AS n ON c.relnamespace = n.oid
     WHERE c.relkind = 'S'
       AND n.nspname = 'public';`
  )) as unknown as Array<{ relname: string }>;
  for (const { relname } of relNames) {
    await prisma.$queryRawUnsafe(
      // eslint-disable-next-line no-useless-escape
      `ALTER SEQUENCE \"public\".\"${relname}\" RESTART WITH 1;`
    );
  }
};
