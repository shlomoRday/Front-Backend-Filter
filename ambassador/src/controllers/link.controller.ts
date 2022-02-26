import { Request, Response } from "express";
import { link } from "fs";
import { getRepository } from "typeorm";
import { client } from "../index";
import { Links} from "../entity/links.entity";

export const getLinks = async (req: Request, res: Response) => {
    const links =await getRepository(Links).find({where:{
        user: req.params.id
    },
    relations:["orders","orders.order_items"]
    });
    res.send(links);
};
export const CreateLinks = async (req: Request, res: Response) => {
    const raw = await client.get("user");
    client.del("user");
    const user = raw && JSON.parse(raw);
    const link =await getRepository(Links).save({user,
        code:Math.random().toString(36).substring(6),
        products:req.body.products.map((id: number)=>id)
    });
    res.send(link);
};

export const Statistic =  async (req: Request, res: Response) => {
   
    const raw = await client.get("user");
    client.del("user");
    const user = raw && JSON.parse(raw);
    const links = await getRepository(Links).find({
        where:{user},
        relations:["orders","orders.order_items"]
    });

    res.send(links.map(link =>{
        const orders = [link.orders]
        const complete_orders = orders.filter(order => order.complete)
        return {
            code: link.code,
            count: complete_orders.length,
            revenue:complete_orders.reduce((s,order)=>s+order.ambassador_revenue,0)
        };
    }));

}
export const GetLinkByCode = async (req:Request, res:Response) =>{
    const codeId = req.params.code
     res.send(await getRepository(Links).findOne({
       where:{
         code:codeId
       },
       relations:["user", "products"]
     }));
   }
   