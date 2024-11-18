require('dotenv').config()
const express=require("express");
const router=express.Router();
const jwt=require('jsonwebtoken');
const { verifyEmail } = require('../controller/user/verify-email.js');
const { getDataOfUser } = require('../controller/user/getData.js');
const { register } = require('../controller/user/register.js');
const { logIn } = require('../controller/user/logIn.js');



// all routes here 
router.post("/register",register);
router.post("/login",logIn);
router.get("/verify/:token",verifyEmail);
router.get("/",getDataOfUser);







module.exports={router}