const {userModel}=require("../../models/User.js")
const jwt=require("jsonwebtoken")

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
            //if exist in database then check password

            const isPasswordMatch=await user_data.matchPassword(password);
             console.log(isPasswordMatch);
                
            if(!isPasswordMatch){
                return res.status(400).json({
                    msg:"Credential not match",
                    success:false
                })
            }
            //if every thing is right
            const token=jwt.sign({id:user_data._id},process.env.NODE_JWT_SECRET_KEY,{expiresIn:"60s"}); 



            res.status(200).json({
                msg:"hello ! this is logIn page",
                success:true,
                token,
                data:{
                    email:email
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


module.exports=logIn