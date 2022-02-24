import { User } from "./entity/user.entity";
declare module "express-serve-static-core" {
  export interface Request {
    user?: User;
  }
}

declare module 'redis'