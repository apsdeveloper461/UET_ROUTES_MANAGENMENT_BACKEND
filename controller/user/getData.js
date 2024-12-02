const { UserModel } = require("../../models/User");
const { decodeToken, verifyToken } = require("../jwt-token");


const getDataOfUser=async(req,res)=>{
    try {
        const {token}=req.body;
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
            const user_data=await UserModel.findById(id).select("-password -isVerified -__v");
            if(!user_data){
                return res.status(404).json({
                    msg:"user not found",
                    success:false
                })
            }
            return res.status(200).json({
                msg:"data fetched successfully",
                data:user_data,
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



module.exports={getDataOfUser}