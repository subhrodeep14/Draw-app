import express from "express";
import jwt from "jsonwebtoken";
import zod from "zod";
import  User  from "./db";
import {middleware} from "./middileware";
const app = express();
const jwtSecret ="jhdjd"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string()
    });

app.post("/signup", async(req:any, res:any) => {
    
    
    const { error } = signupSchema.safeParse(req.body);
    if(error) {
        return res.status(400).send(error.errors);
    }
    const existingUser = User.findOne({ username: req.body.username });
    if(!existingUser) {
        return res.status(400).send("User already exists"); 
    }
    const user = await User.create(
        {
            username: req.body.username,
            password: req.body.password
        }
    );

    const token = jwt.sign({ username: user.username},jwtSecret);

    res.json({
       "meassge":"User created" ,
         token
         });
});

app.post("/signin",async(req:any, res:any) => {
    
    
    const { error } = signupSchema.safeParse(req.body);
    if(error) {
        return res.status(400).send(error.errors);
    }
    const existingUser =await User.findOne({ username: req.body.username });

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
    res.send("Room created");
});
    
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});