require('dotenv').config()
const express=require("express");
const router=express.Router();
const { verifyEmail } = require('../controller/user/verify-email.js');
const { getDataOfUser } = require('../controller/user/getData.js');
const { register } = require('../controller/user/register.js');
const { logIn } = require('../controller/user/logIn.js');
const { forgetPassword, VerifyForgetPassword } = require('../controller/user/forgetPassword.js');



// all routes here 
router.post("/register",register);
router.post("/login",logIn);
router.post("/forget-password",forgetPassword);
router.post("/forget-password/verify/:token",VerifyForgetPassword);
router.get("/verify/:token",verifyEmail);
router.get("/",getDataOfUser);







module.exports={router}