import express, { Request, Response } from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import routerUser from "./routes/routeUser";
import routerProduct from "./routes/routeProduct";
import routerlink from "./routes/routeLink";
import routerOrder from "./routes/routeOrder";

import { config } from "dotenv";

config({ path: "./.env" });
createConnection().then(() => {
  const app = express();
  app.use(express.json({ limit: "10kb" }));
  app.use(cors({ origin: ["http://127.0.0.1:3000"] }));
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello world");
  });
  app.use("/api/admin", routerUser);
  app.use("/api/admin/product", routerProduct);
  app.use("/api/admin/users", routerlink);
  app.use("/api/admin/orders/", routerOrder);


  app.listen(process.env.PORT, () => {
    console.log("listen to port 8000");
  });
});
