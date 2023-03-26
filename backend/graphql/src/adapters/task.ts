import { nonNull, objectType, stringArg, arg, inputObjectType } from 'nexus';
import { Adapter } from '../adapter';
import { Context } from '../context';
import { getUserFromHeaders } from '../utils';

export default Adapter<'task'>({
  schema: [
    objectType({
      name: 'task',
      definition(t) {
        t.nonNull.string('id');
        t.nonNull.string('authorId');
        t.nonNull.string('content');
        t.nonNull.string('title');
      },
    }),
  ],
  resolver: {
    Query: (t) => {
      t.nonNull.list.nonNull.field('tasks', {
        type: 'task',
        args: undefined,
        resolve: async (_parent, _args, context: Context) => {
          const user = await getUserFromHeaders(context);
          const tasks = await context.prisma.task.findMany({
            where: {
              authorId: user.id,
            },
          });
          return tasks;
        },
      });
    },
    Mutation: (t) => {
      t.nonNull.field('createTask', {
        type: 'task',
        args: {
          title: nonNull(stringArg()),
          content: nonNull(stringArg()),
        },
        resolve: async (_parent, { title, content }, context: Context) => {
          const user = await getUserFromHeaders(context);
          const task = await context.prisma.task.create({
            data: {
              title,
              authorId: user.id,
              content,
            },
          });
          return task;
        },
      });
    },
  },
  permissions: {
    Query: {},
    Mutation: {},
  },
});
