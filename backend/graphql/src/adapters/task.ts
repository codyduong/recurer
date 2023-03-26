import { nonNull, objectType, stringArg, intArg } from 'nexus';
import { Adapter } from '../adapter';
import { Context } from '../context';
import { rules } from '../rules';
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
        t.nonNull.int('points');
        t.nonNull.field('deadline', { type: 'DateTime' });
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
          points: intArg(),
          deadline: stringArg(),
        },
        resolve: async (
          _parent,
          { title, content, points, deadline },
          context: Context,
        ) => {
          const user = await getUserFromHeaders(context);
          const task = await context.prisma.task.create({
            data: {
              title: title || null!,
              authorId: user.id,
              content: content,
              points: points ?? 0,
              recurring: false,
              deadline: deadline
                ? new Date(deadline).toISOString()
                : new Date(0),
            },
          });
          return task;
        },
      });
      t.nonNull.field('updateTask', {
        type: 'task',
        args: {
          id: nonNull(stringArg()),
          title: stringArg(),
          content: stringArg(),
          points: intArg(),
          pointsCompleted: intArg(),
          deadline: stringArg(),
        },
        resolve: async (
          _parent,
          { id, title, content, points, deadline, pointsCompleted },
          context: Context,
        ) => {
          return context.prisma.task.update({
            data: {
              title: title ?? undefined,
              content: content ?? undefined,
              points: points ?? undefined,
              deadline: deadline ?? undefined,
              pointsCompleted: pointsCompleted ?? undefined,
            },
            where: {
              id: id,
            },
          });
        },
      });
      t.nonNull.field('deleteTask', {
        type: 'task',
        args: {
          id: nonNull(stringArg()),
        },
        resolve: async (_parent, { id }, context: Context) => {
          return context.prisma.task.delete({
            where: {
              id: id,
            },
          });
        },
      });
    },
  },
  permissions: {
    Query: {},
    Mutation: {
      updateTask: rules.taskOwner,
      deleteTask: rules.taskOwner,
    },
  },
});
