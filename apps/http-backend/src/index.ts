import express from "express";
import jwt from "jsonwebtoken";
import { signUpSchema, signInSchema, roomSchema } from "@repo/common/types";
import { middleware } from "./middileware";
import { JWT_SECRET } from '@repo/backend-common/config'
import { prismaClient } from "@repo/db/config"
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.post("/signup", async (req: any, res: any) => {


    const parseData = signUpSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({ "message": "Invalid data" });
    }

    try {
        await prismaClient.user.create({
            data: {
                email: parseData.data.username,
                password: parseData.data.password,
                name: parseData.data.name
            }
        });

        const token = jwt.sign({ username: parseData.data.username }, JWT_SECRET);

        res.json({
            "meassge": "User created",
            token
        });

    } catch (error) {
        res.status(400).json({
            "message": "User already exists"
        });

    }

});

app.post("/signin", async (req: any, res: any) => {


    const parseData = signInSchema.safeParse(req.body);

    if (!parseData.success) {
        res.json({
            message: "incorrect inputs"
        })
        return;
    }
    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email: parseData.data?.username,
                password: parseData.data?.password
            }
        })
        if (!user) {
            res.json({
                message: "user does not exist"
            })
            return;
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.json({
            token
        })
        
    } catch (error) {
        res.status(411).json({
            message:"something went wrong"
        })
    }

});

app.post("/room", middleware, async (req:any, res:any) => {
    //db call
    const parseData = roomSchema.safeParse(req.body);
    if (!parseData.success) {
        res.json({
            message: "Invalid data"
        });
        return;
    }
    const userId=req.userId;
    
    try {
        await prismaClient.room.create({
            data:{
                slug:parseData.data.roomName,
                adminId:userId
            }
        })
    
        res.json({messeage:"Room created"});
        
    } catch (error) {
        res.send("room already exist");
    }

 
});

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});