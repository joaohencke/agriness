import OAuthServer, { Request, Response } from 'oauth2-server';
import UnauthorizedRequestError from 'oauth2-server/lib/errors/unauthorized-request-error';
import * as oauthManager from './auth.manager';
import AuthModel from './auth.model';

const oauthServer = new OAuthServer({ model: oauthManager });

export const _handleSuccess = (res, response) => {
  if (res.status === 302) {
    const { location } = response.headers;
    delete response.headers.location;
    res.set(response.headers);
    return res.redirect(location);
  }

  res.set(response.headers);
  return res.status(response.status).send(response.body);
};

export const _handleError = (e, res, response) => {
  if (response) res.set(response.headers);
  res.status(e.code);
  if (e instanceof UnauthorizedRequestError) return res.send();

  return res.send({ error: e.name, error_description: e.message });
};

export const authenticate = options => async (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);
  try {
    const token = await oauthServer.authenticate(request, response, options);
    res.locals.oauth = { token };
    req.user = token.user;
    return next();
  } catch (e) {
    return _handleError(e, res, response, next);
  }
};

export const authorize = options => async (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  try {
    const code = await oauthServer.authorize(request, response, options);
    res.locals.oauth = { code };
    return _handleSuccess(res, response);
  } catch (e) {
    return _handleError(e, res, response, next);
  }
};

export const token = options => async (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  try {
    const _token = await oauthServer.token(request, response, options);
    res.locals.oauth = { token: _token };
    req.user = token.user;

    return _handleSuccess(res, response);
  } catch (e) {
    return _handleError(e, res, response, next);
  }
};

export const revoke = () => async (req, res, next) => {
  try {
    await AuthModel.findByIdAndDelete(res.locals.oauth.token._id);
    next();
  } catch (e) {
    next();
  }
};
