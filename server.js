import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middlewares/index.js';

const app = express();

app.use(
   cors({
      origin: process.env.ALLOWED_ORIGINS,
      credentials: true
   })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(
   cookieParser({
      overWrite: true
   })
);

app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());

app.get('/', (req, res) => {
   res.json({
      message: 'Card Game API 🃏'
   });
});

//routes
import authRouter from './routes/auth/index.js';
import gameRouter from './routes/games/index.js';
import savedGameRouter from './routes/savedGames/index.js';
import statsRouter from './routes/stats/index.js';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/games', gameRouter);
app.use('/api/v1/saved', savedGameRouter);
app.use('/api/v1/stats', statsRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
   .connect(process.env.MONGO_URI)
   .then(() => {
      console.info('connected to mongo database');
      app.listen(PORT, () => console.info(`server listening on port ${PORT}`));
   })
   .catch(err => console.error(err));
