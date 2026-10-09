import "reflect-metadata";
import express, { type Request as req, type Response as res } from "express";
import routes from "./routes/routes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from 'cors';
import { env } from './config/env.js';

const app = express();

app.use(express.json({ limit: '5mb' }));

app.use(cors({
  origin: env.frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(routes);
app.use(errorMiddleware);

export default app;
