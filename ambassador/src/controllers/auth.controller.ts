import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import {hash, compare, genSaltSync} from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Order } from "../entity/order.entity";

const signToken = (id: string) => {
  return sign({ id: id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user: User, res: Response) => {
  const token = signToken(String(user.id));

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };
  if (process.env.NODE_ENV !== "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);

  // this for removing password from the output

  res.send({ token, message: "Success login" });
};
export const Register = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).send({
      message: "Password's do not match!",
    });
  }
  const salt = genSaltSync(10);
  const user = await getRepository(User).save({
    first_name,
    last_name,
    email,
    password: await hash(String(password),salt),
    is_ambassador: req.baseUrl === "/api/ambassador",
  });
  res.send(user);
};

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).send({
      message: "Password or email are not correct!",
    });
  }
  const user = await getRepository(User).findOne(
    { email: email },
    {
      select: ["id", "password"],
    }
  );
  if (!user) {
    return res.status(400).send({
      message: "Invalid credentoals!",
    });
  }
  if (user && !(await compare(String(password), user?.password))) {
    return res.status(400).send({
      message: "Invalid credentoals!",
    });
  }

  createSendToken(user, res);
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  if(req.baseUrl.includes("ambassador")){
    return res.send(req.user);
  }
  const orders = await getRepository(Order).find({
    where:{
      user_id:req.user?.id,
      complete:true
    },relations:["order_items"]
  });
  const user = req.user;
  user!.revenue = orders.reduce((s,item)=> s+ item.ambassador_revenue,0);
};

export const Logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 + 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  res.status(200).json({
    status: "logout successefuly!",
  });
};

export const UpdateProfile = async (req: Request, res: Response) => {
  const user: any = req.user;
  await getRepository(User).update(user?.id, req.body);
  res.send({ message: "sucess" });
};

export const UpdatePassword = async (req: Request, res: Response) => {
  const user: any = req.user;
  const { password, confirm_password } = req.body;
  if (password !== confirm_password) {
    res.status(400).send({
      message: "Password's do not match!",
    });
  }
  const salt = genSaltSync(10);
  await getRepository(User).update(user?.id, {
    password: await hash(String(password), salt),
  });
  res.send({
    message: "success",
  });
};


export const RestritLogin = async (req:Request, res:Response) => {
  
  const user = await getRepository(User).findOne({ email:req.body.email},{
    select:["id","password","is_ambassador"]
  })
  if(!user){
    return res.status(401).send({
      message: "invalid credentials!",
    });
  }
  const restrict = req.path === "/api/admin/login";
  if (user?.is_ambassador && restrict) {
    res.status(401).send({
      message: "unatuthorized",
    });
  }
  createSendToken(user,res);
};
