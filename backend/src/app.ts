import "reflect-metadata";
import express, { type Request as req, type Response as res } from "express";
import { testConnection } from "./config/database.js";
import routes from "./routes/routes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(errorMiddleware);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const startServer = async () => {
  await testConnection();
  
  app.listen(3000, () => {
    console.log("Zenith Server is running on port 3000");
  });
};

app.use(routes);
startServer();
