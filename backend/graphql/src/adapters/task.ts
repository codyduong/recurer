import { task } from '@prisma/client';
import { and, not } from 'graphql-shield';
import { nonNull, objectType, stringArg, intArg, booleanArg } from 'nexus';
import { Adapter } from '../adapter';
import { Context } from '../context';
import { rules } from '../rules';
import { getUserFromHeaders } from '../utils';

/**
 * For fields that are added later but no migration is done:
 */
const safeifyTask = (task: task): task => {
  return { ...task, complete: task.complete ?? false };
};

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
        t.nonNull.int('pointsCompleted');
        t.nonNull.field('dateStart', { type: 'DateTime' });
        t.nonNull.field('dateEnd', { type: 'DateTime' });
        t.nonNull.boolean('complete');
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
          return tasks.map((task) => safeifyTask(task));
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
          pointsCompleted: intArg(),
          dateStart: stringArg(),
          dateEnd: nonNull(stringArg()),
          complete: booleanArg(),
        },
        resolve: async (
          _parent,
          {
            title,
            content,
            points,
            pointsCompleted,
            dateStart,
            dateEnd,
            complete,
          },
          context: Context,
        ) => {
          const user = await getUserFromHeaders(context);
          const task = await context.prisma.task.create({
            data: {
              title: title || null!,
              authorId: user.id,
              content: content,
              points: points ?? 0,
              pointsCompleted: pointsCompleted ?? 0,
              recurring: false,
              dateStart: dateStart ?? dateEnd ?? undefined,
              dateEnd: dateEnd,
              complete: complete ?? false,
            },
          });
          return safeifyTask(task);
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
          dateStart: stringArg(),
          dateEnd: stringArg(),
          complete: booleanArg(),
        },
        resolve: async (
          _parent,
          {
            id,
            title,
            content,
            points,
            pointsCompleted,
            dateStart,
            dateEnd,
            complete,
          },
          context: Context,
        ) => {
          const task = await context.prisma.task.update({
            data: {
              title: title ?? undefined,
              content: content ?? undefined,
              points: points ?? undefined,
              pointsCompleted: pointsCompleted ?? undefined,
              dateStart: dateStart ?? undefined,
              dateEnd: dateEnd ?? undefined,
              complete: complete ?? undefined,
            },
            where: {
              id: id,
            },
          });
          return safeifyTask(task);
        },
      });
      t.nonNull.field('completeTask', {
        type: 'task',
        args: {
          id: nonNull(stringArg()),
        },
        resolve: async (_parent, { id }, context: Context) => {
          const task = await context.prisma.task.update({
            data: {
              complete: true,
            },
            where: {
              id: id,
            },
          });
          return safeifyTask(task);
        },
      });
      t.nonNull.field('deleteTask', {
        type: 'task',
        args: {
          id: nonNull(stringArg()),
        },
        resolve: async (_parent, { id }, context: Context) => {
          const task = await context.prisma.task.delete({
            where: {
              id: id,
            },
          });
          return safeifyTask(task);
        },
      });
    },
  },
  permissions: {
    Query: {},
    Mutation: {
      createTask: not(rules.demo),
      updateTask: and(not(rules.demo), rules.taskOwner),
      deleteTask: and(not(rules.demo), rules.taskOwner),
      completeTask: and(not(rules.demo), rules.taskOwner),
    },
  },
});
