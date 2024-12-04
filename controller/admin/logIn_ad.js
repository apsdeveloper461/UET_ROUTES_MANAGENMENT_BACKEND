const {AdminModel}=require('../../models/Admin')
const { generateToken } = require("../jwt-token.js");

const logIn_ad=async(req,res)=>{
    // console.log("I login");
    
    try {
        const {email,password}=req.body;    
        if(email&&password){
            const admin_data=await AdminModel.findOne({email:email});
            if(!admin_data){
                return res.status(400).json({
                    msg:"user not found",
                    success:false
                })
            }
            //if exist in database then check password
            const isPasswordMatch=await admin_data.matchPassword(password);
            //  console.log(isPasswordMatch);
                
            if(!isPasswordMatch){
                return res.status(400).json({
                    msg:"Credentials not correct",
                    success:false
                })
            }
            //if every thing is right
            const token=generateToken(admin_data._id,"7d");



            res.status(200).json({
                msg:"hello ! this is logIn page",
                success:true,
                token,
                data:{
                    id:admin_data._id,
                    username:admin_data.username,
                    email:admin_data.email
                }
            })
        }else{
            res.status(400).json({
                msg:`something is missing | ${error?.message || error} `,
                success:false
            })
        }
        
    } catch (error) {
        res.status(500).json({
            msg:error?.message || error,
            success:false
        })
        
    }
  
}


module.exports={logIn_ad}