


const {userModel}=require("../../models/User.js");
const { verifyToken, decodeToken, generateToken } = require("../jwt-token.js");


const verifyEmail=async(req,res)=>{
    try {

        // console.log("token in email verify route ");
        const {token}=req.params;
        // console.log(token);
        
        if(!token){
            return res.status(400).json({
                msg:"token not found",
                success:false
            })
        }
        // if token is avaiable 
        const isValidToken=verifyToken(token);
        if(!isValidToken){
            return res.status(400).json({
                msg:"token not valid",
                success:false
            })
        }else{
            const {id}=decodeToken(token);
            // console.log(id);
            const user = await userModel.findByIdAndUpdate(
                id,
                { isVerified: true },
                { new: true } // Return the updated user document
              );
              const newToken=generateToken(user._id,"7d");
            return res.status(200).json({
                msg:"Verified successfully",
                token:newToken,
                data:{
                    id:user._id,
                    username:user.username,
                    email:user.email
                },
                success:true
            })
        }
    } catch (error) {
        res.status(500).json({
            msg:error?.message||error,
            success:false
        })
    }   

}


module.exports={
    verifyEmail
}