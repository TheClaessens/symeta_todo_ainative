import { Controller, Get } from '@nestjs/common';
import { HealthCheck, type HealthCheckResult } from '@nestjs/terminus';

import { HealthService } from '@/modules/health/health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthService.check();
  }
}
