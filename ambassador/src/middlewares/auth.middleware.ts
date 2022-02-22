import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { verify } from "jsonwebtoken";
export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    let token: string = req.params.token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers.cookie) {
      token = req.headers.cookie.split("=")[1];
    }
    
    //const jwt = req.cookies("jwt");
    let decoded: any = verify(token, process.env.JWT_SECRET!);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    req.user = await getRepository(User).findOne(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
};
