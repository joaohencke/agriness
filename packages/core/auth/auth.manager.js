import AuthModel from './auth.model';

import { getByPassword as getUserByPassword } from '../user/user.manager';

const auth = {
  clientId: process.env.OAUTH_CLIENT_ID || '@agriness',
  clientSecret: process.env.OAUTH_CLIENT_SECRET || '5b65583a513923cc5db5e283cfa565ba',
  grants: ['password', 'refresh_token'],
};

export const getClient = () => ({
  id: auth.clientId,
  client_secret: auth.clientSecret,
  grants: auth.grants,
});

const format = ({ token, type, expiresAt, userId }) => {
  const maps = {
    refresh_token: {
      expiresAt: 'refreshTokenExpiresAt',
      token: 'refreshToken',
    },
    access_token: {
      expiresAt: 'accessTokenExpiresAt',
      token: 'accessToken',
    },
  };

  const formatted = { client: { id: auth.clientId }, user: { id: userId } };

  formatted[maps[type].expiresAt] = expiresAt;
  formatted[maps[type].token] = token;

  return formatted;
};

const get = async ({ accessToken, refreshToken }) => {
  const query = {
    token: accessToken || refreshToken,
    type: accessToken ? 'access_token' : 'refresh_token',
  };
  const token = await AuthModel.findOne(query)
    .populate('user')
    .lean();
  if (!token) return null;
  return format(token);
};

export const getUser = (username, password) => getUserByPassword({ password, username });

export const getAccessToken = accessToken => get({ accessToken });

export const getRefreshToken = refreshToken => get({ refreshToken });

export const saveToken = async (token, client, user) => {
  const accessToken = new AuthModel({
    token: token.accessToken,
    expiresAt: token.accessTokenExpiresAt,
    type: 'access_token',
    clientId: auth.id,
    userId: user._id,
  });

  const refreshToken = new AuthModel({
    token: token.refreshToken,
    expiresAt: token.refreshTokenExpiresAt,
    type: 'refresh_token',
    clientId: auth.id,
    userId: user._id,
  });

  await Promise.all([accessToken.save(), refreshToken.save()]);

  return {
    ...format(accessToken.toObject()),
    ...format(refreshToken.toObject()),
  };
};

export const revokeToken = async token => {
  const result = await AuthModel.remove({
    token: token.refreshToken,
    type: 'refresh_token',
  });
  return !!result.n;
};
