import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from '@/modules/common/common.module';
import { HealthController } from '@/modules/health/health.controller';
import { HealthService } from '@/modules/health/health.service';

@Module({
  imports: [TerminusModule, HttpModule, CommonModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
