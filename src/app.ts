import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import splitRoutes from '@/routes/SplitRoutes';
import billRoutes from '@/routes/BillRoutes';
import { Config, prodConfig } from '@/util';
import { corsMiddleware, protectedRoutesMiddleware } from '@/middleware';


export const AppFactory = (config: Config = prodConfig) => {
  const app = express();
  const PORT = config.port || 5000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(corsMiddleware())

  app.get("/hello", (req: Request, res: Response) => {
    res.json({ hello: 'bitch' })
  });

  app.use(protectedRoutesMiddleware())

  app.use(billRoutes);
  app.use(splitRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

AppFactory()

