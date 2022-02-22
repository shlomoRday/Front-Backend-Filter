import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Links} from "../entity/links.entity";

export const getLinks = async (req: Request, res: Response) => {
    const links =await getRepository(Links).find({where:{
        user: req.params.id
    }});
    res.send(links);
};
