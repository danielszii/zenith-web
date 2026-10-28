import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env.js';
import { AppError } from './errors/AppError.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import routes from './routes/routes.js';

const app = express();

app.disable('x-powered-by');
if (env.isProduction) app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '5mb' }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.frontendUrls.includes(origin.replace(/\/$/, ''))) return callback(null, true);
    return callback(new AppError('Origem não autorizada pelo CORS.', 403));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { code: 429, message: 'Muitas tentativas de login. Aguarde alguns minutos.' },
}));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(routes);
app.use(errorMiddleware);

export default app;