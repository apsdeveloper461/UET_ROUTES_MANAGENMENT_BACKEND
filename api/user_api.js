require('dotenv').config()
const express=require("express");
const router=express.Router();
const {logIn,register}=require("../controller/user.js")

const jwt=require('jsonwebtoken')
router.post("/register",register);
router.post("/login",logIn);


router.get("/",(req,res)=>{
    try {
        const {token}=req.body;
        if(!token){
            return res.status(400).json({
                msg:"token not found",
                success:false
            })
        }
        // if token is avaiable 
        const isValidToken=jwt.verify(token,process.env.NODE_JWT_SECRET_KEY);
        if(!isValidToken){
            return res.status(400).json({
                msg:"token not valid",
                success:false
            })
        }else{
            return res.status(200).json({
                msg:"hello world! token is valid",
                success:true
            })
        }
    } catch (error) {
        res.status(500).json({
            msg:error?.message||error,
            success:false
        })
    }
})





module.exports={router}