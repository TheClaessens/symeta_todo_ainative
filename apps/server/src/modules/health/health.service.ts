import { Injectable } from '@nestjs/common';
import {
  type HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

import { CommonService } from '@/modules/common/common.service';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly commonService: CommonService
  ) {}

  async check(): Promise<HealthCheckResult> {
    const baseUrl = this.commonService.getBaseUrl();

    return this.health.check([
      () => this.prisma.pingCheck('database', this.prismaService),
      async () =>
        this.http.pingCheck('graphql', `${baseUrl}/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: { query: '{ __typename }' },
        }),
      async () => this.http.pingCheck('rest-api', `${baseUrl}/api`),
    ]);
  }
}
