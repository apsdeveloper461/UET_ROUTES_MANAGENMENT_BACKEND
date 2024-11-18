require('dotenv').config();
const jwt=require("jsonwebtoken");

const generateToken=(id,time)=>{
    console.log("User id for token is generated",id);
    
    return jwt.sign({id},process.env.NODE_JWT_SECRET_KEY,{expiresIn:time});
}

const verifyToken=(token)=>{
    
    return jwt.verify(token,process.env.NODE_JWT_SECRET_KEY);
}

const decodeToken=(token)=>{
    return jwt.decode(token);
}

module.exports={
    generateToken,
    verifyToken,
    decodeToken
}