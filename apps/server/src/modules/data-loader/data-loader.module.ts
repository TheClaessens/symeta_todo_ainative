import {
  DynamicModule,
  type InjectionToken,
  Module,
  type OptionalFactoryDependency,
} from '@nestjs/common';

import { DataLoaderService } from '@/modules/data-loader/data-loader.service';
import {
  DATALOADER_OPTIONS,
  type DataLoaderOptions,
} from '@/modules/data-loader/data-loader.types';

@Module({})
export class DataLoaderModule {
  static forRoot(options?: DataLoaderOptions): DynamicModule {
    return {
      module: DataLoaderModule,
      providers: [
        {
          provide: DATALOADER_OPTIONS,
          useValue: options ?? {},
        },
        DataLoaderService,
      ],
      exports: [DataLoaderService],
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (
      ...args: Array<InjectionToken | OptionalFactoryDependency>
    ) => DataLoaderOptions;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
  }): DynamicModule {
    return {
      module: DataLoaderModule,
      providers: [
        {
          provide: DATALOADER_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        DataLoaderService,
      ],
      exports: [DataLoaderService],
      global: true,
    };
  }
}
