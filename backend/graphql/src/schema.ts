import { makeSchema, asNexusMethod, enumType } from 'nexus';
import { DateTimeResolver } from 'graphql-scalars';
import generateSchema from './utils/generateSchema';
import { applyMiddleware } from 'graphql-middleware';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');

export const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
});

export const schema = async () => {
  const { types, permissions } = await generateSchema();

  return applyMiddleware(
    makeSchema({
      types: [SortOrder, DateTime, ...types],
      outputs: {
        schema: __dirname + '/../schema.graphql',
        typegen: __dirname + '/generated/nexus.ts',
      },
      sourceTypes: {
        modules: [
          {
            module: '@prisma/client',
            alias: 'prisma',
          },
        ],
      },
    }),
    permissions,
  );
};
