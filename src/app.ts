import express, { Request, Response } from 'express';
import { get_config } from '../util';
import billRoutes from './routes/BillRoutes';
import splitRoutes from './routes/SplitRoutes';


function AppFactory() {
  const app = express();
  const config = get_config()
  const PORT = config.port

  app.use(billRoutes);

  app.use("/split", splitRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}

AppFactory();
