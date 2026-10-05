import type { StandardSchemaConverter } from '@nestjs/swagger';
import { z } from 'zod';

interface StandardVendor {
  '~standard'?: {
    vendor?: string;
  };
}

function isZodStandardSchema(schema: unknown): schema is z.ZodType {
  if (!schema || typeof schema !== 'object') {
    return false;
  }

  return (schema as StandardVendor)['~standard']?.vendor === 'zod';
}

function extractComponents(
  jsonSchema: Record<string, unknown>
): Record<string, unknown> {
  const defs = jsonSchema.$defs ?? jsonSchema.definitions;
  if (!defs || typeof defs !== 'object' || Array.isArray(defs)) {
    return {};
  }

  return defs as Record<string, unknown>;
}

function omitDefinitions(
  jsonSchema: Record<string, unknown>
): Record<string, unknown> {
  const {
    $defs: _defs,
    definitions: _definitions,
    $schema: _schema,
    ...rest
  } = jsonSchema;
  return rest;
}

/**
 * Converts Zod Standard Schema instances into OpenAPI 3.0 schemas for
 * `@nestjs/swagger`'s `standardSchemaConverter` option.
 */
export const zodStandardSchemaConverter: StandardSchemaConverter = (
  schema,
  { schemaType }
) => {
  if (!isZodStandardSchema(schema)) {
    return undefined;
  }

  const jsonSchema = z.toJSONSchema(schema, {
    target: 'openapi-3.0',
    io: schemaType,
  }) as Record<string, unknown>;

  return {
    schema: omitDefinitions(jsonSchema),
    components: extractComponents(jsonSchema),
  };
};
