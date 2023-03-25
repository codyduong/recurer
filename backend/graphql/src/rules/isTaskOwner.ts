import { Context } from '../context';
import { getUserFromHeaders } from '../utils';

const isTaskOwner = async (args: any, context: Context) => {
  const user = getUserFromHeaders(context);
  // const author = await context.prisma.task.findUnique({
  //   where: {
  //     id: args.id,
  //   },
  // }).author;

  // return userId === author.id;
  return false;
};

export default isTaskOwner;
