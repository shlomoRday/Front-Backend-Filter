import { Request, Response } from "express";
import Stripe  from "stripe";
import { getConnection, getRepository } from "typeorm";
import { client } from "../index";
import { Links } from "../entity/links.entity";
import { Order } from "../entity/order.entity";
import { OrderItem } from "../entity/orderItem.entity";
import { Product } from "../entity/product.entity";
import { User } from "../entity/user.entity";
import { Ranks } from "../entity/rankings.entity";
import { createTransport } from "nodemailer";

export const Orders = async (req:Request, res:Response)=>{
 const orders = await getRepository(Order).find({
     where:{complete:true},
     relations:["order_items"]
 });
 res.send(orders.map((order:Order)=>({
   id:order.id,
   name: order.fullName,
   email:order.email,
   total: order.total,
   created_at: order.created_at,
   order_items: order.order_items

 })));
}


export const CreateOreder = async (req:Request, res:Response) =>{
 
const {first_name, code, email,last_name, country,address,zip, city,products} = req.body;

const link = await getRepository(Links).findOne({
  where:{code:code},
  relations:["user"]
});
if(!link){
  return res.status(400).send({
    message:" invalid link!"
  })
}
const qRounner = getConnection().createQueryRunner();
await qRounner.connect();
await qRounner.startTransaction();
try{
let order = new Order();
order.user_id= link.user.id;
order.ambassador_email = link.user.email;
order.first_name =first_name;
order.last_name= last_name;
order.email=email;
order.address=address;
order.city= city;
order.country=country;
order.zip= zip;
order = await qRounner.manager.save(order);

const lineItems= [];
for(let p of products){
  const product=await getRepository(Product).findOne(p.product_id);
  const order_item = new OrderItem();
  order_item.order= order;
  order_item.product_title =  product?.title? product.title:"";
  order_item.price= product?.price? product.price: 0;
  order_item.quantity = p.quantity;
  order_item.ambassador_revenue = 0.1 * order_item.price * p.quantity;
  order_item.admin_revenue = 0.9 * order_item.price *p.quantity;
  await qRounner.manager.save(order_item);
  lineItems.push({
    name:product?.title,
    description:product?.decsription,
    images: [product?.image || ""],
    amount: 100 * Number(product?.price),
    currency:"usd",
    quantity:p.quantity

  });
  
}
 const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY),{
   apiVersion:"2020-08-27"
 });
 const src =await stripe.checkout.sessions.create({
   payment_method_types:["card"],
   line_items:lineItems,
   success_url:`${process.env.CHECKOUT_URL}/success?source={CHECKOUT_SESSION_ID}`,
   cancel_url:`${process.env.CHECKOUT_URL}/error`
 })
 order.transaction_id = src.id; 
 await qRounner.manager.save(order);
await qRounner.commitTransaction();
res.send(order);
} catch (error) {
  await qRounner.rollbackTransaction();
  return res.status(400).send({
    message:" invalid link!"
  })
}
}

export const ConfirmPaymentOrder = async (req:Request, res:Response) =>{

  const order= await getRepository(Order).findOne(
    {
      where:{
        transaction_id: req.body.src
      },
      relations:["order_itmes"]
    });

    if (!order){
      return res.status(400).send({
        message:"Sorry, order not found"
      });
    }
    await getRepository(Order).update(order.id, {complete:true});
    const user = await getRepository(User).findOne(order.user_id);
    await getRepository(Ranks).increment({fullName:user?.fullName},"score",1);
    //await client.zincrby("rangkings",order.ambassador_revenue, String(user?.fullName));

    const transporter = createTransport({
      host:"smtp.mailtrap.io",
      port:2525,
      auth:{
        user:"4161550ba4ff90",
        pass:"8a3a5f6d01a764"

      }
    });
    transporter.sendMail({
      from:"exmple@gmail.com",
      to:order.ambassador_email,
      subject:`An order has been completed`,
      html:`You earned $${order.ambassador_revenue} from the link #${order.code}`
    })
    transporter.close();
    res.send({
      message:"success"
    });

}