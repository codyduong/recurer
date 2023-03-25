import { extendType } from 'nexus/dist/core';
import type { Adapter, SchemaType } from './adapter';

const processAdapter = <TypeName extends string>(
  adapter: Adapter<TypeName>,
): {
  schema: SchemaType<TypeName>[];
  permissions: Adapter<TypeName>['permissions'];
} => {
  const resolvers = [
    extendType({
      type: 'Query',
      definition: (t) => adapter.resolver.Query?.(t),
    }),
    extendType({
      type: 'Mutation',
      definition: (t) => adapter.resolver.Mutation?.(t),
    }),
  ];

  if (Array.isArray(adapter.schema)) {
    return {
      schema: [...adapter.schema, ...resolvers],
      permissions: adapter.permissions,
    };
  } else {
    return {
      schema: [adapter.schema, ...resolvers],
      permissions: adapter.permissions,
    };
  }
};

export default processAdapter;
