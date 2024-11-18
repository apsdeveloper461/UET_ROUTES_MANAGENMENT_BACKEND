require('dotenv').config()
const {userModel}=require("../../models/User.js");
const { generateToken } = require('../jwt-token.js');
const sendEmailWithLink = require('../send-email.js');
const register=async(req,res)=>{
    try{
     const {name,email,password}=req.body;
    //  console.log(name,email,password);
    if(email&&password&&name){
        const IsUserExist=await userModel.findOne({email:email});
        if(IsUserExist){
            return res.status(400).json({
                msg:"user already exist",
                success:false
            })
        }
        const user=await userModel.create({
            username:name,
            email:email,
            password:password
        })

        const token=generateToken(user._id,"24h");
        sendEmailWithLink(email,"Verify your email",`${process.env.NODE_EMAIL_ROUTE_VERIFY}/${token}`);
        

        // code 201 used for created in item 
        res.status(201).json({
            msg:"Check your email to verifcation",
            email:email,
            success:true,
        })
    }else{
        // code 400 means bad request 
        res.status(400).json({
            msg:`something is missing | ${error?.message || error} `,
            success:false          
        })
    }
   
 }catch(error){
    // code 500 means internal server error 
    res.status(500).json({
        msg:error?.message || error,
        success:false
    })
 }
  
}


module.exports={register}