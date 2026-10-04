import "reflect-metadata";
import express, { type Request as req, type Response as res } from "express";
import routes from "./routes/routes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from 'cors';

const app = express();

app.use(express.json({ limit: '5mb' }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(routes);
app.use(errorMiddleware);

export default app;
