const { AdminModel } = require("../../models/Admin");
const { decodeToken, verifyToken } = require("../jwt-token");


const getDataOfAdmin=async(req,res)=>{
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
            const admin_data=await AdminModel.findById(id);
            return res.status(200).json({
                msg:"data fetched successfully",
                data:{
                    id:admin_data._id,
                    username:admin_data.username,
                    email:admin_data.email
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



module.exports={getDataOfAdmin}