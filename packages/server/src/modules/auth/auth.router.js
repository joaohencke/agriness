import express from 'express';
import { token, authenticate, revoke } from './auth.oauth';

const authRouter = express.Router();

export default authRouter;

authRouter.post(
  '/token',
  (req, res, next) => {
    if (req.is('json')) {
      req.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    next();
  },
  token({
    /* accessTokenLifetime: 5, */ requireClientAuthorization: {
      password: false,
      refresh_token: false,
    },
  }),
);

authRouter.post('/revoke', authenticate(), revoke());
