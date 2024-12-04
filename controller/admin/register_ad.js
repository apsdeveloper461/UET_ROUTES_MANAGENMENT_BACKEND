const {AdminModel}=require("../../models/Admin.js");
const register_ad=async(req,res)=>{
    // console.log("I lregisterin");
    try{
     const {name,email,password}=req.body;
    //  console.log(name,email,password);
    if(email&&password&&name){
        const IsUserExist=await AdminModel.findOne({email:email});
        if(IsUserExist){
            return res.status(400).json({
                msg:"user already exist",
                success:false
            })
        }
        const user=await AdminModel.create({
            username:name,
            email:email,
            password:password
        })

        // code 201 used for created in item 
        res.status(201).json({
            msg:"Go to Login page ",
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


module.exports={register_ad}