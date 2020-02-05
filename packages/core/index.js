import authRouter from './auth';
import animalsRouter from './animals';
import usersRouter from './user';

export default {
  auth: authRouter,
  animals: animalsRouter,
  users: usersRouter,
};
