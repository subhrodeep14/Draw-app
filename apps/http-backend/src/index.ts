import express from "express";
import jwt from "jsonwebtoken";
import {signUpSchema,signInSchema,roomSchema} from "@repo/common/config";
import  User  from "./db";
import {middleware} from "./middileware";
import {jwtSecret} from "@repo/backend-common/config";
import {prismaClient} from "@repo/db/config";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.post("/signup", async(req:any, res:any) => {
    
    
    const parseData = signUpSchema.safeParse(req.body);
    if(!parseData.success) {
        return res.status(400).json({"message":"Invalid data"});
    }

    try {
        await prismaClient.user.create({
            data: {
                email: parseData.data.username,
                password: parseData.data.password,
                name: parseData.data.name
            }
        });
    
        const token = jwt.sign({ username: parseData.data.username }, jwtSecret);
    
        res.json({
           "meassge":"User created" ,
             token
             });
        
    } catch (error) {
        res.status(400).json({
            "message": "User already exists"
        });
        
    }

});

app.post("/signin",async(req:any, res:any) => {
    
    
    const parseData = signInSchema.safeParse(req.body);
    try {
        
        if(parseData.success) {
    
    
            const existingUser =await User.findOne({ username: parseData.data.username, password: parseData.data.password });
        
            if(existingUser) {
                
             const token = jwt.sign({username:existingUser.username },jwtSecret);
            return res.json({
               "message":"User not found",
                  token
              });
            }
            }
            
    } catch (error) {
        res.status(400).json({
            "message": "User already exists" 
    });
        
    }
    

});

app.post ("/room",middleware, async(req, res) => {
    //db call
    const data=roomSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message:"Invalid data"
        });
        return;
    }

    res.send("Room created");
});
    
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});