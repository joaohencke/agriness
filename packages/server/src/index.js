import express from 'express';
import helmet from 'helmet';
import chalk from 'chalk';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { error as errorHandler } from '@agriness/middleware';
import apis from '@agriness/core';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import config from './config';
import docs from './docs';

const app = express();

export default app;

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  config: { autoIndex: true },
});
app.use(morgan('short'));
app.use(helmet());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(docs)));

Object.keys(apis).forEach(path => {
  app.use(`/${path}`, apis[path]);
});

// eslint-disable-next-line
app.use((err, req, res, next) => errorHandler(res, err));

app.listen(config.port, () => console.info(chalk.cyan(`express listening at ${config.port}`)));
