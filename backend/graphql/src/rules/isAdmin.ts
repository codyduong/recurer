import { Context } from '../context';
import { getUserFromHeaders } from '../utils';

const isAdmin = async (context: Context): Promise<boolean> => {
  try {
    return (await getUserFromHeaders(context)).roles.admin;
  } catch (e) {
    console.warn(e);
  }
  return false;
};

export default isAdmin;
