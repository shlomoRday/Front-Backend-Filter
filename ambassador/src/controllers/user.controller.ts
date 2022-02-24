import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { client } from "..";
import { Order } from "../entity/order.entity";
import { Ranks } from "../entity/rankings.entity";
import { User } from "../entity/user.entity";

export const Ambassadors = async (req: Request, res: Response) => {
  await client.del("user");
  res.send(await getRepository(User).find({ is_ambassador: true }));
};

export const Ranking = async (req:Request, res:Response) =>{
   
  //const result = await client.zremrangebyscore("rankings", "+inf","-inf");
  await client.del("user");
  const result = await getRepository(Ranks).find({
    order:{
      score:"DESC",
      fullName:"ASC"
    }
  });
  res.send(result);
}