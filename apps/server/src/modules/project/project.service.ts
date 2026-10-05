import { ConflictException, Injectable } from '@nestjs/common';
import { type Prisma } from '@repo/database';

import { PaginationService } from '@/modules/pagination/pagination.service';
import { type OffsetPagination } from '@/modules/pagination/pagination.utils';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  type Project,
  type ProjectPage,
} from '@/modules/project/models/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService
  ) {}

  async list({
    ownerId,
    pagination,
  }: {
    ownerId: string;
    pagination: OffsetPagination;
  }): Promise<ProjectPage> {
    return this.pagination.offsetPaginate<
      Prisma.ProjectGetPayload<object>,
      'Project'
    >({
      model: this.prisma.project,
      where: { ownerId },
      orderBy: 'position',
      pagination,
    });
  }

  async create({
    ownerId,
    name,
  }: {
    ownerId: string;
    name: string;
  }): Promise<Project> {
    const normalizedName = name.toLowerCase();

    try {
      // ponytail: count then insert; two concurrent creates can share a position. Unique (ownerId, position) if that matters.
      return await this.prisma.$transaction(async (tx) => {
        const position = await tx.project.count({ where: { ownerId } });
        return tx.project.create({
          data: {
            ownerId,
            name,
            normalizedName,
            position,
          },
          select: {
            id: true,
            name: true,
            position: true,
          },
        });
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException();
      }
      throw error;
    }
  }
}
