import { NextFunction,Request,Response } from "express";
import  Jwt  from "jsonwebtoken";
import { jwtSecret } from "@repo/backend-common/config"

export function middleware(req:Request, res:Response, next:NextFunction) {

    const token=req.headers["authorization"] ??"";
    const decoded= Jwt.verify(token, jwtSecret);

    if(decoded) {
        //@ts-ignore
        req.user=decoded.userId;
        next();
    }else{
        res.status(401).send("Unauthorized");
    }
    

  };   