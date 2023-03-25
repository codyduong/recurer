import { PrismaClient } from '@prisma/client';
import type { ContextFunction } from '@apollo/server';
import type express from 'express';

export interface ExpressContextFunctionArgument {
  req: express.Request;
  res: express.Response;
}

export interface Context extends ExpressContextFunctionArgument {
  prisma: PrismaClient;
}

const prisma = new PrismaClient();

export const context: ContextFunction<
  [ExpressContextFunctionArgument],
  Context
> = async (context): Promise<any> => {
  return {
    ...context,
    prisma: prisma,
  };
};
