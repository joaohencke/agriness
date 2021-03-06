import express from 'express';
import { token, authenticate, revoke } from './auth.oauth';

const authRouter = express.Router();

export default authRouter;

/**
 * @swagger
 * /auth/token:
 *   post:
 *     description: Create new token to use in authenticated requests
 *     parameters:
 *       - in: body
 *         name: client_id
 *         type: string
 *         example: agriness
 *         description: client id
 *       - in: body
 *         name: client_secret
 *         type: string
 *         example: 5b65583a513923cc5db5e283cfa565ba -> only
 *         description: client_secret generated by me
 *       - in: body
 *         name: username
 *         type: string
 *         example: porcoaranha
 *       - in: body
 *         name: password
 *         type: string
 *         example: 123123
 *     responses:
 *       '200':
 *         description: tokens used to access another endpoints
 */
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
