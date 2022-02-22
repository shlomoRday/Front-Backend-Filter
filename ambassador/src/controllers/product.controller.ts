import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Product } from "../entity/product.entity";

export const CreateProduct = async (req: Request, res: Response) => {
  res.status(201).send(await getRepository(Product).save(req.body));
};

export const GetProduct = async (req: Request, res: Response) => {
  res.status(201).send(await getRepository(Product).findOne(req.params.id));
};

export const UpdateProduct = async (req: Request, res: Response) => {
  await getRepository(Product).update(req.params.id, req.body);
  res.status(201).send({ message: "Update sucesseed" });
};

export const DeleteProduct = async (req: Request, res: Response) => {
  await getRepository(Product).delete(req.params.id);
  res.status(201).send({ message: "Delete sucesseed" });
};
