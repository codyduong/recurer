import { rule } from 'graphql-shield';
import type { Context } from '../context';
import isAdmin from './isAdmin';
import isDemo from './isDemo';
import isTaskOwner from './isTaskOwner';

export const rules = {
  admin: rule()(async (_parent, _args, context: Context) => {
    return await isAdmin(context);
  }),
  demo: rule()(async (_parent, args, context: Context) => {
    return await isDemo(context);
  }),
  taskOwner: rule()(async (_parent, args, context: Context) => {
    // Don't allow editing on tasks on demo account
    return await isTaskOwner(args, context);
  }),
};

export { isAdmin, isDemo, isTaskOwner };
