require('dotenv').config()
const jwt=require("jsonwebtoken")
const {userModel}=require("../../models/User.js")
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

        const token=jwt.sign({id:user._id},process.env.NODE_JWT_SECRET_KEY,{expiresIn:"60s"});
        // code 201 used for created in item 
        res.status(201).json({
            msg:"hello ! this is register page",
            success:true,
            token,
            data:{
                name:name,
                email:email
            }
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


module.exports=register