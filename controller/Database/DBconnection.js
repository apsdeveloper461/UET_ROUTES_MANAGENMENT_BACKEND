const mongoose=require("mongoose");
require('dotenv').config(); 


const DBConnection=async()=>{
    try {
        await mongoose.connect(process.env.NODE_DB_STRING);
        console.log("Database connected")
    } catch (error) {
        console.log(error);
    }
}

module.exports=DBConnection
