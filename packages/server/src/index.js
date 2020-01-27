import express from 'express';
import helmet from 'helmet';
import chalk from 'chalk';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { error as errorHandler } from '@agriness/middleware';
import apis from './apis';
import config from './config';

const app = express();

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  config: { autoIndex: true },
});

app.use(morgan('short'));
app.use(helmet());
app.use(express.json());

Object.keys(apis).forEach(path => {
  app.use(`/${path}`, apis[path]);
});

// eslint-disable-next-line
app.use((err, req, res, next) => errorHandler(res, err));

app.listen(config.port, () => console.info(chalk.cyan(`express listening at ${config.port}`)));
