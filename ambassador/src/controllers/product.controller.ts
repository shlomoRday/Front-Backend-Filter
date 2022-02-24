import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Product } from "../entity/product.entity";
import { client } from "../index";
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

export const GetAllProducts = async (req:Request, res:Response) =>{

  try {
    const productList = await client.get("products_front");
    let products = productList && JSON.parse(productList)
    console.log();
  if(!products){
    console.log("no a");
     products = await getRepository(Product).find();
     client.set("products_front",JSON.stringify(products));
  }
  res.send(products );
  } catch (error) {
    res.status(401).send({message: error})
  }
}

export const GetProductsOnBackend = async (req:Request, res:Response) =>{

  try {
    const productList = await client.get("products_front");
    let products:Product[] = productList && JSON.parse(productList)
  if(!products){
    console.log("no a");
     products = await getRepository(Product).find();
     client.set("products_front",JSON.stringify(products));
  }
  const q:string|undefined = req.query.q?.toString().toLocaleLowerCase();
  if(q){
    products= products.filter(p => p.title.toLowerCase().includes(q) || p.decsription.toLowerCase().includes(q));
  }
  if(req.query.sort === "asc" || req.query.sort === "desc" ){
      products.sort((a,b) => {
        const diff = a.price - b.price;
        if(diff===0){    
          return 0
        }
        const toSign=Math.abs(diff) /diff;
        return req.query.sort == "asc"? toSign: -toSign;
      }) 
  }

  const page:number = parseInt(req.query.p as any) || 1;
  const sizePage = 7;
  const pages = products.length || 0;
  const data = products.slice((page-1)*sizePage, page*sizePage);
  console.log(
    pages,
    page)
  res.send({
    data,
    pages,
    page,
    lastPage:Math.ceil(pages/sizePage)
  });
  } catch (error) {
    res.status(401).send({message: error})
  }
}

