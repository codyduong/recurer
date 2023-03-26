import { nonNull, objectType, stringArg, arg, inputObjectType } from 'nexus';
import { Adapter } from '../adapter';
import { Context } from '../context';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { APP_SECRET, getUserFromHeaders } from '../utils';
import { isAdmin, rules } from '../rules';

export default Adapter<'user'>({
  schema: [
    inputObjectType({
      name: 'UserRolesArg',
      definition(t) {
        t.nonNull.boolean('admin');
        t.nonNull.boolean('demo');
      },
    }),
    objectType({
      name: 'UserRoles',
      definition(t) {
        t.nonNull.boolean('admin');
        t.nonNull.boolean('demo');
      },
    }),
    objectType({
      name: 'user',
      definition(t) {
        t.nonNull.string('id');
        t.nonNull.string('email');
        t.nonNull.string('name');
        t.nonNull.field('roles', { type: 'UserRoles' });
      },
    }),
    objectType({
      name: 'UserAuthPayload',
      definition(t) {
        t.string('token');
        t.field('user', { type: 'user' });
      },
    }),
  ],
  resolver: {
    Query: (t) => {
      t.field('user', {
        type: 'user',
        args: {
          email: nonNull(stringArg()),
        },
        resolve: async (_parent, { email }, context: Context) => {
          const user = await context.prisma.user.findUnique({
            where: {
              email,
            },
          });
          return user;
        },
      });
      t.field('currentUser', {
        type: 'user',
        args: {},
        resolve: async (_parent, _args, context: Context) => {
          const user = await getUserFromHeaders(context);
          const isActualUser = await context.prisma.user.findUnique({
            where: {
              id: user.id,
            },
          });
          return isActualUser;
        },
      });
    },
    Mutation: (t) => {
      t.field('createUser', {
        type: 'UserAuthPayload',
        args: {
          email: nonNull(stringArg()),
          password: nonNull(stringArg()),
          name: nonNull(stringArg()),
          roles: arg({
            type: 'UserRolesArg',
          }),
        },
        resolve: async (
          _parent,
          { email, password, name, roles },
          context: Context,
        ) => {
          const hashedPassword = await hash(password, 10);
          // only another admin can set roles by default
          if (roles && !isAdmin(context)) {
            context.res
              .status(403)
              .send('Settings userRoles requires admin permissions');
          }
          const defaultRoles = {
            admin: false,
            demo: false,
          };
          const user = await context.prisma.user.create({
            data: {
              email: email || null!,
              password: hashedPassword,
              roles: roles ?? defaultRoles,
              name: name || null!,
            },
          });
          return {
            token: sign({ id: user.id }, APP_SECRET),
            user,
          };
        },
      });
      t.field('loginUser', {
        type: 'UserAuthPayload',
        args: {
          email: nonNull(stringArg()),
          password: nonNull(stringArg()),
        },
        resolve: async (_parent, { email, password }, context: Context) => {
          /**
           * TODO prevent login if already logged in, check "Authorization" header
           */
          const user = await context.prisma.user.findUniqueOrThrow({
            where: {
              email,
            },
          });
          const passwordValid = await compare(password, user.password);
          if (!passwordValid) {
            throw new Error('Invalid password');
          }
          return {
            token: sign({ id: user.id }, APP_SECRET),
            user,
          };
        },
      });
    },
  },
  permissions: {
    Query: {},
    Mutation: {
      createUser: rules.admin,
    },
  },
});
