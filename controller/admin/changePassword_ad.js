const {AdminModel}=require('../../models/Admin')
const { decodeToken } = require("../jwt-token.js");

const changePassword_ad=async(req,res)=>{
    try {
        const {token,password}=req.body;
        if(token&&password){
            const {id}=decodeToken(token);
            if(!id){
                return res.status(400).json({
                    msg:"Invalid token",
                    success:false
                })
            }
            const admin_data=await AdminModel.findById(id);
            if(!admin_data){
                return res.status(400).json({
                    msg:"user not found",
                    success:false
                })
            }
            //if exist in database then check password
            admin_data.password=password;
            await admin_data.save();
            res.status(200).json({
                msg:"Password changed successfully",
                success:true
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


module.exports={changePassword_ad}