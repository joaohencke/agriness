import express from 'express';
import helmet from 'helmet';
import chalk from 'chalk';
import mongoose from 'mongoose';
import handler from './utils/middleware/error.handler';
import apis from './apis';
import config from './config';

const app = express();

mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, config: { autoIndex: true } });

app.use(helmet());
app.use(express.json());

Object.keys(apis).forEach(path => {
  app.use(`/${path}`, apis[path]);
});

app.use((err, req, res, next) => handler(res, err));

app.listen(config.port, () => console.info(chalk.cyan(`express listening at ${config.port}`)));
