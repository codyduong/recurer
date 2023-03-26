import { Context } from '../context';
import { getUserFromHeaders } from '../utils';

const isDemo = async (context: Context): Promise<boolean> => {
  try {
    return (await getUserFromHeaders(context)).roles.demo;
  } catch (e) {
    console.warn(e);
  }
  return false;
};

export default isDemo;
