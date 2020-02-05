import express from 'express';
import { validate } from '@agriness/middleware';
import * as yup from 'yup';
import { create } from './user.manager';

const router = express.Router();

export default router;

/**
 * @swagger
 * /users:
 *   post:
 *     description: Create new user
 *     parameters:
 *       - in: body
 *         name: username
 *         type: string
 *         example: porcoaranha
 *         description: username used to login
 *       - in: body
 *         name: password
 *         type: string
 *         example: 123123
 *         description: password used to login
 *     responses:
 *       '201':
 *         description: Created user
 */
router.post(
  '/',
  validate({
    path: 'body',
    schema: {
      username: yup.string().required(),
      password: yup.string().required(),
    },
  }),
  (req, res, next) => {
    create(req.validData)
      .then(user => res.status(201).json(user))
      .catch(next);
  },
);
