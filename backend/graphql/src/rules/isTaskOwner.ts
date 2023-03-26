import { Context } from '../context';
import { getUserFromHeaders } from '../utils';

const isTaskOwner = async (args: any, context: Context) => {
  const user = await getUserFromHeaders(context);
  const task = await context.prisma.task.findUnique({
    where: {
      id: args.id,
    },
  });

  return user.id === task?.authorId;
};

export default isTaskOwner;
