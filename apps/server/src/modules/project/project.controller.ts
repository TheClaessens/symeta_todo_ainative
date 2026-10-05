import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { Auth } from '@/modules/auth/auth.decorator';
import { ApiOffsetPagination } from '@/modules/common/decorators/api-offset-pagination.decorator';
import { type IUser, User } from '@/modules/common/decorators/user.decorator';
import {
  type OffsetPagination,
  offsetPaginationSchema,
} from '@/modules/pagination/pagination.utils';
import {
  type CreateProjectRequest,
  createProjectSchema,
  projectPageSchema,
  projectSchema,
} from '@/modules/project/models/project.dto';
import { ProjectService } from '@/modules/project/project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Auth()
  @ApiOffsetPagination()
  @ApiOperation({
    operationId: 'listProjects',
    summary: 'List projects',
  })
  @ApiOkResponse({ standardSchema: projectPageSchema })
  @SerializeOptions({ schema: projectPageSchema })
  async list(
    @User() user: IUser,
    @Query({ schema: offsetPaginationSchema }) pagination: OffsetPagination
  ) {
    return this.projectService.list({ ownerId: user.id, pagination });
  }

  @Post()
  @Auth()
  @ApiOperation({
    operationId: 'createProject',
    summary: 'Create a project',
  })
  @ApiCreatedResponse({ standardSchema: projectSchema })
  @SerializeOptions({ schema: projectSchema })
  async create(
    @User() user: IUser,
    @Body({ schema: createProjectSchema }) body: CreateProjectRequest
  ) {
    return this.projectService.create({ ownerId: user.id, name: body.name });
  }
}
