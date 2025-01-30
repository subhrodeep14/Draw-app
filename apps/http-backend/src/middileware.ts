import { NextFunction,Request,Response } from "express";
import  Jwt  from "jsonwebtoken";
import { jwtSecret } from "./config"

export function middleware(req:Request, res:Response, next:NextFunction) {

    const token=req.headers.authorization ??"";
    const decoded= Jwt.verify(token, jwtSecret);

    if(!decoded) {
        return res.status(401).send("Unauthorised");
    }else {
        //@ts-ignore
        req.user=decoded.userId;
        next();
    }
    

  };   