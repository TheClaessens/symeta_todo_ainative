import { z } from 'zod';

import { offsetPaginatedResultSchema } from '@/modules/pagination/pagination.utils';

export const projectSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    position: z.number(),
  })
  .meta({ id: 'Project' });

export type Project = z.infer<typeof projectSchema>;

export const createProjectSchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .meta({ id: 'CreateProjectRequest' });

export type CreateProjectRequest = z.infer<typeof createProjectSchema>;

export const projectPageSchema = offsetPaginatedResultSchema(
  projectSchema
).meta({
  id: 'ProjectPage',
});

export type ProjectPage = z.infer<typeof projectPageSchema>;
