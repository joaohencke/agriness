import boom from 'boom';
import UserModel from './user.model';

// eslint-disable-next-line
export const getByPassword = async ({ username, password }) => {
  const user = await UserModel.findOne({ username }).select('+password');
  if (!user) throw boom.badRequest('invalid_credentials');

  const passwordMatch = await user.checkPassword(password);

  if (!passwordMatch) throw boom.badRequest('invalid_credentials');

  return {
    ...user.toObject(),
    password: undefined,
  };
};
