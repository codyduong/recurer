import { nonNull, objectType, stringArg, arg, inputObjectType } from 'nexus';
import { Adapter } from '../adapter';
import { Context } from '../context';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { APP_SECRET } from '../utils';
import { isAdmin } from '../rules';

export default Adapter<'user'>({
  schema: [
    inputObjectType({
      name: 'UserRolesArg',
      definition(t) {
        t.nonNull.boolean('admin');
      },
    }),
    objectType({
      name: 'UserRoles',
      definition(t) {
        t.nonNull.boolean('admin');
      },
    }),
    objectType({
      name: 'user',
      definition(t) {
        t.nonNull.string('id');
        t.nonNull.string('email');
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
    },
    Mutation: (t) => {
      t.field('createUser', {
        type: 'UserAuthPayload',
        args: {
          email: nonNull(stringArg()),
          password: nonNull(stringArg()),
          roles: arg({
            type: 'UserRolesArg',
          }),
        },
        resolve: async (
          _parent,
          { email, password, roles },
          context: Context,
        ) => {
          const hashedPassword = await hash(password, 10);
          // only another admin can set roles by default
          if (!isAdmin(context) && roles) {
            context.res
              .status(403)
              .send('Settings userRoles requires admin permissions');
          }
          const defaultRoles = {
            admin: false,
          };
          const user = await context.prisma.user.create({
            data: {
              email: email,
              password: hashedPassword,
              roles: roles ?? defaultRoles,
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
    Mutation: {},
  },
});
