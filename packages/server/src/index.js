import express from 'express';
import helmet from 'helmet';
import chalk from 'chalk';

import config from './config';

const app = express();

app.use(helmet());
app.use(express.json());

app.listen(config.port, () => console.info(chalk.cyan(`express listening at ${config.port}`)));
