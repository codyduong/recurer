import { verify } from 'jsonwebtoken';
import type { Context } from '../context';
import type { user } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

export const APP_SECRET = process.env['APP_SECRET']!;

export type Token = {
  id: string;
};

export const getUserFromHeaders = async (context: Context): Promise<user> => {
  const authHeader = context.req.get('Authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const verifiedToken = verify(token, APP_SECRET) as Token;
    if (verifiedToken && verifiedToken.id) {
      // double check the user actually exists
      const user = await context.prisma.user.findUniqueOrThrow({
        where: {
          id: verifiedToken.id,
        },
      });
      return user;
    }
  }

  context.res.status(401).send('No Authorization header was found');
  throw new Error('No Authorization header was found');
};

export { default as generateSchema } from './generateSchema';
