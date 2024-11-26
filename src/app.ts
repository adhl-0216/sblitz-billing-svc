import express, { Request, Response } from 'express';
import cors from "cors";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { errorHandler } from 'supertokens-node/framework/express';

import ensureSuperTokensInit from './supertokensInit';
import splitRoutes from '@/routes/SplitRoutes';
import billRoutes from '@/routes/BillRoutes';
import { Config, prodConfig } from '@/util';

export const AppFactory = (config: Config = prodConfig) => {
  const app = express();
  const PORT = config.port || 5000;

  ensureSuperTokensInit()

  app.use(cors({
    origin: "http://localhost",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  }));

  app.use(middleware());

  // Hello
  app.get("/hello", (req: Request, res: Response) => {
    res.json({ hello: 'world' })
  });

  // Protected Routes
  app.use(verifySession())

  app.use(billRoutes);
  app.use(splitRoutes);

  app.use(errorHandler())

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

AppFactory()

