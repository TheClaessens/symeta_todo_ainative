import { Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { env } from '@/env';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class CommonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  /**
   * Gets the base URL of the server.
   *
   * @returns The base URL of the server
   */
  getBaseUrl() {
    if (env.BACKEND_URL) {
      return env.BACKEND_URL;
    }
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const server = httpAdapter.getHttpServer();
    const address = server.address();

    const protocol = env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = address.address === '::' ? 'localhost' : address.address;
    const port = address.port;

    return `${protocol}://${host}:${port}`;
  }
}
