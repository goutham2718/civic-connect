import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import validator from "validator";
import jwt from "jsonwebtoken";

export const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success:false,
                msg:"User not found"
            })
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.json({
                success:false,
                msg:"Incorrect password"
            })
        }
        const token = createToken(user._id)
        res.json({
                success:true,
                token:token
            })
    }catch (error) {
        res.json({
            success:false,
            message:"Error"
        })
    }
}

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: '7d'})
}

export const registerUser = async (req,res)=>{
    const {name,email,password} = req.body;
    try {
        const exist = await userModel.findOne({email})
        if(exist){
            return res.json({
                success:false,
                msg:"Email already exist"
            })
        }
        if(!validator.isEmail(email)){
            return res.json({
                success:false,
                msg:"Please enter a valid email"
            })
        }
        if(password.length<8){
            return res.json({
                success:false,
                msg:"Please enter a strong password"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedpw = await bcrypt.hash(password,salt)
        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedpw
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({
            success:true,
            token:token
        })
     } catch (error) {
        res.json({
            success:false,
            message:"Error"
        })
    }
}

export const getMe = async (req, res) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user'});
  }
};