import express from 'express';
import { validate } from '@agriness/middleware';
import * as yup from 'yup';
import { create } from './user.manager';

const router = express.Router();

export default router;

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
