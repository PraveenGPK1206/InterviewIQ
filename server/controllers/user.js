import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {createError} from "../error.js"
export const signup = async(req,res,next)=>{ 
    try{
       console.log(req.body);
       const salt = bcrypt.genSaltSync(10);
       const hash = bcrypt.hashSync(req.body.password, salt); 
       const newUser= new User({...req.body, password:hash}); 
       await newUser.save();  
      res.status(201).json({ message: "User created" }); 
      }catch(err){
       next(err);
    }
   };
   


export const signin=async(req,res,next)=>{ 
     try{
       const user = await User.findOne({ email: req.body.email });
        if(!user) return next(createError(404,"user not found")); 
         const isCorrect= await bcrypt.compare(req.body.password,user.password); 
         if(!isCorrect) return next(createError(400,"Wrong credentials")); 
         const { password, ...data } = user._doc;
      res.status(200).json(data); 
    }catch(err){
    next(err);
    }
};
   

   
