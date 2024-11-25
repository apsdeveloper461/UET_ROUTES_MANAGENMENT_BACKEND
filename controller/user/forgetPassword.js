const { generateToken, decodeToken } = require("../jwt-token");
const { userModel } = require("../../models/User");
const sendEmailWithLink = require("../send-email");


const forgetPassword = async (req, res) => {

    try {
        const { email } = req.body;
        if (!email) {
           throw new Error("Email not found");
        }

        const user = await userModel.findOne({ email: email });
        if(!user){
            throw new Error("User not found");
        }
        const token = generateToken(user._id, "1h");
        await sendEmailWithLink(user.email,"Forget Password of UET Routes Management System", `${process.env.NODE_FRONTEND_URL}/user/auth/forget-password/${token}`);
        res.status(200).json({
            msg: "Verification Code sent to your email",
            success: true
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
             msg:error?.message||error,
            success:false
         });
    }

}





const VerifyForgetPassword=async(req,res)=>{

    try {
        const {token}=req.params;
        const {password}=req.body;
    
        if(!token && !password){
            throw new Error("Token & password not found");
        }
        const {id}=decodeToken(token);
        console.log(id);
        
        if(!id){
            throw new Error("Invalid token");
        }
    
       const User= await userModel.findById(id);
       if(!User){
           throw new Error("User not found");   
       }
        User.password=password;
        await User.save();
      
        // console.log(id);
        // const user=await userModel
        res.status(200).json({
            msg:"Password changed successfully",
            success:true
        })
        
    } catch (error) {
        res.status(500).json({
            msg:error?.message || error,
            success:false
        })
    }
    }
    


module.exports={forgetPassword,VerifyForgetPassword} 