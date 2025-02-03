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
    
    
    const { error } = signUpSchema.safeParse(req.body);
    if(error) {
        return res.status(400).send(error.errors);
    }
    const existingUser = User.findOne({ username: req.body.username });
    if(!existingUser) {
        return res.status(400).send("User already exists"); 
    }

    prismaClient.user.create({
        data: {
          email: req.body.username,
          password: req.body.password,
        },
    })
    

    const token = jwt.sign({ username: user.username},jwtSecret);

    res.json({
       "meassge":"User created" ,
         token
         });
});

app.post("/signin",async(req:any, res:any) => {
    
    
    const { error } = signInSchema.safeParse(req.body);
    if(error) {
        return res.status(400).send(error.errors);
    }
    const existingUser =await User.findOne({ username: req.body.username, password: req.body.password });

    if(existingUser) {
        
     const token = jwt.sign({username:existingUser.username },jwtSecret);
    return res.json({
       "message":"User not found",
          token
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