import express, { Request, Response } from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import routerUser from "./routes/routeUser";
import routerProduct from "./routes/routeProduct";
import routerlink from "./routes/routeLink";
import routerOrder from "./routes/routeOrder";
import routerAmbassador from "./routes/routeAmbassador";
import { config } from "dotenv";

const redis = require('redis');

const client = redis.createClient({
  host: 'redis',
  port: 6379,
});

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
  app.use("/api/admin/orders", routerOrder);
  app.use("/api/ambassador", routerAmbassador);

  client.on('error', (err: string) => {
    console.log('Error ' + err);
});

client.set('foo', 'bar', (err: any, reply: any) => {
  if (err) throw err;
  console.log(reply);

  client.get('foo', (err: any, reply: any) => {
      if (err) throw err;
      console.log(reply);
  });
})

  app.listen(process.env.PORT, () => {
    console.log("listen to port 8000");
  });
  
});
function session(session: any) {
  throw new Error("Function not implemented.");
}

