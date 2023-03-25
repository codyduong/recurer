import { rule } from 'graphql-shield';
import type { Context } from '../context';
import isAdmin from './isAdmin';
import isTaskOwner from './isTaskOwner';

export const rules = {
  admin: rule()(async (_parent, _args, context: Context) => {
    return await isAdmin(context);
  }),
  taskOwner: rule()(async (_parent, args, context: Context) => {
    return await isTaskOwner(args, context);
  }),
};

export { isAdmin, isTaskOwner };
