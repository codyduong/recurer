import { join } from 'path';
import { shield } from 'graphql-shield';
import { processAdapter } from '../adapter';
import { SchemaType } from '../adapter/adapter';
import glob from 'glob';
import type { IOptionsConstructor } from 'graphql-shield/typings/types';

const permissionsDebug: IOptionsConstructor | undefined =
  process.env.NODE_ENV === 'development'
    ? {
        debug: true,
      }
    : undefined;

const generateSchema = async (): Promise<{
  types: SchemaType<any>[];
  permissions: ReturnType<typeof shield>;
}> => {
  const schemaTypes: SchemaType<any>[] = [];
  let permissionsObject: Parameters<typeof shield>[0] = {};

  const js = __filename.includes('.js') ? true : false;
  const files = await glob(
    `${js ? 'dist' : 'src'}/adapters/**/*${js ? '.js' : '.ts'}`,
    { nodir: true },
  );
  await Promise.all(
    files.map(async (file: string) => {
      try {
        const p = join(__dirname, '../..', file);
        const adapter = (await import(p)).default;
        const { schema, permissions: newPermissions } = processAdapter(adapter);
        schemaTypes.push(...schema);
        permissionsObject = {
          Query: {
            ...((permissionsObject as any).Query ?? {}),
            ...newPermissions.Query,
          },
          Mutation: {
            ...((permissionsObject as any).Mutation ?? {}),
            ...newPermissions.Mutation,
          },
        };
      } catch (e) {
        console.warn(e);
      }
    }),
  );

  return {
    types: schemaTypes,
    permissions: shield(permissionsObject, permissionsDebug),
  };
};

export default generateSchema;
