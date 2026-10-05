import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import {
  Module,
  StandardSchemaSerializerInterceptor,
  StandardSchemaValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { env } from '@/env';
import { AppController } from '@/modules/app/app.controller';
import { AppService } from '@/modules/app/app.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { HttpExceptionFilter } from '@/modules/common/filters/http-exception.filter';
import { DataLoaderModule } from '@/modules/data-loader/data-loader.module';
import { DataLoaderService } from '@/modules/data-loader/data-loader.service';
import { HealthModule } from '@/modules/health/health.module';
import { PaginationModule } from '@/modules/pagination/pagination.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [() => env],
    }),
    PrismaModule,
    PaginationModule,
    HealthModule,
    AuthModule,
    DataLoaderModule.forRoot({
      maxBatchSize: 100,
      cache: true,
      debug: env.NODE_ENV === 'development',
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [DataLoaderService],
      useFactory: (dataLoaderService: DataLoaderService) => ({
        autoSchemaFile: join(process.cwd(), '.generated/schema.gql'),
        introspection: true,
        graphiql: true,
        context: ({ req }: { req: Request }) => ({
          req,
          loaders: dataLoaderService.createLoaders(),
        }),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new StandardSchemaValidationPipe({
          transform: true,
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StandardSchemaSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    AppService,
  ],
})
export class AppModule {}
