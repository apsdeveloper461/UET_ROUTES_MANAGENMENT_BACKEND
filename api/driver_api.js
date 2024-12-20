
const express=require("express");
const { DriverModel } = require("../models/Driver");
const { generateToken, decodeToken } = require("../controller/jwt-token");
const router_dr=express.Router();



// all routes here 
router_dr.post("/login",async(req,res)=>{
    try{
        const {email,cnic}=req.body;

        
        console.log(email,cnic);
        if(!email || !cnic){
            return res.status(400).json({msg:"Please fill all the fields",success:false});
        }
        const driver=await DriverModel.findOne({email:email,cnic:cnic});
        if(!driver){
            return res.status(400).json({msg:"Invalid Credentials",success:false});
        }
        const token= generateToken(driver._id,'1d');

        res.status(200).json({msg:"Login Successfully",data:driver,token:token,success:true});
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"Internal Server Error",success:false});
    }
    
}

);

router_dr.get("/_d/:token",async(req,res)=>{

    try {
        const {token}=req.params;
        if(!token){
            return res.status(400).json({msg:"Please provide token",success:false});
        }
        const {id}=decodeToken(token);
        const driver=await DriverModel.findById(id);
        if(!driver){
            return res.status(400).json({msg:"Invalid Token",success:false});
        }
        res.status(200).json({msg:"Driver Found",data:driver,success:true});


    } catch (error) {
        res.status(500).json({msg:"Internal Server Error",success:false});
    }
})

// router_dr.get("/_d",async(req,res)=>{
//     try {

//         const drivers=await DriverModel.find();
//         res.status(200).json({msg:"All Drivers",data:drivers,success:true});
//     } catch (error) {
//         res.status(500).json({msg:"Internal Server Error",success:false});
//     }
// })





module.exports={router_dr}