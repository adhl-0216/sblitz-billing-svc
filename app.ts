import express, { Request, Response } from 'express';
import { get_config } from './util';


function AppFactory() {
  const app = express();
  const config = get_config()
  const PORT = config.port

  app.post("/bill", (req: Request, res: Response) => {

  });
  app.get("/bill/:billId", (req: Request, res: Response) => {
    const { billId } = req.params;
    res.send(billId)
  });
  app.put("/bill/:billId", (req: Request, res: Response) => {
    const { billId } = req.params;
  });
  app.delete("/bill/:billId", (req: Request, res: Response) => {
    const { billId } = req.params;
  });

  app.post("/bill/:billId/member", (req: Request, res: Response) => { });
  app.get("/bill/:billId/member/:userId", (req: Request, res: Response) => { });
  app.put("/bill/:billId/member/:userId", (req: Request, res: Response) => { });
  app.delete("/bill/:billId/member/:userId", (req: Request, res: Response) => { });

  app.post("/bill/:billId/item", (req: Request, res: Response) => { });
  app.get("/bill/:billId/item/:itemId", (req: Request, res: Response) => { });
  app.put("/bill/:billId/item/:itemId", (req: Request, res: Response) => { });
  app.delete("/bill/:billId/item/:itemId", (req: Request, res: Response) => { });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}

AppFactory();
