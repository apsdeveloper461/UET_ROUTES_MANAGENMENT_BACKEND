const {userModel}=require("../../models/User.js")
const { generateToken } = require("../jwt-token.js");
const sendEmailWithLink = require("../send-email.js");

const logIn=async(req,res)=>{
    try {
        const {email,password}=req.body;    
        if(email&&password){
            const user_data=await userModel.findOne({email:email});
            if(!user_data){
                return res.status(400).json({
                    msg:"user not found",
                    success:false
                })
            }
            // check verifcation is satisfies
            const isVerified=user_data.isVerified;
            if(!isVerified){       
                    const Token=generateToken(user_data._id,"24h");
                    sendEmailWithLink(email,"Verify your email to continue",`${process.env.NODE_FRONTEND_URL}/user/auth/verify${token}`);
                    return res.status(400).json({
                        msg:"User not verified, Go to Email for verifcation",
                        email:user_data.email,
                        success:false
                    })
            }
            //if exist in database then check password
            const isPasswordMatch=await user_data.matchPassword(password);
            //  console.log(isPasswordMatch);
                
            if(!isPasswordMatch){
                return res.status(400).json({
                    msg:"Credentials not correct",
                    success:false
                })
            }
            //if every thing is right
            const token=generateToken(user_data._id,"7d");



            res.status(200).json({
                msg:"hello ! this is logIn page",
                success:true,
                token,
                data:{
                    id:user_data._id,
                    username:user_data.username,
                    email:user_data.email
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


module.exports={logIn}