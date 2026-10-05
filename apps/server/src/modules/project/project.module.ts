import { Module } from '@nestjs/common';

import { ProjectController } from '@/modules/project/project.controller';
import { ProjectService } from '@/modules/project/project.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
