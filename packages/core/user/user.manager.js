import boom from 'boom';
import UserModel from './user.model';

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

export const create = async ({ username, password }) => {
  const user = new UserModel({ username, password: await UserModel.hashPassword(password) });
  await user.save();
  return {
    ...user.toObject(),
    password: undefined,
  };
};
