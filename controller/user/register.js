require("dotenv").config();
const { UserModel } = require("../../models/User.js");
const { generateToken } = require("../jwt-token.js");
const sendEmailWithLink = require("../send-email.js");
const register = async (req, res) => {
  try {
    console.log(req.body);
    
    const { name, email, password, phone_no, address } = req.body;
     console.log(name,email,password);
    if (email && password && name && phone_no && address) {
        console.log("inside if");
        
      const IsUserExist = await UserModel.findOne({ email: email });
      if (IsUserExist) {
        return res.status(400).json({
          msg: "user already exist",
          success: false,
        });
      }
      const user = await UserModel.create({
        username: name,
        email: email,
        password: password,
        phone_no: phone_no,
        address: address,
      });

      const token = generateToken(user._id, "24h");
      await sendEmailWithLink(
        email,
        "Verify your email",
        `${process.env.NODE_FRONTEND_URL}/user/auth/verify/${token}`
      );

      // code 201 used for created in item
      res.status(201).json({
        msg: "Check your email to verifcation",
        email: email,
        success: true,
      });
    } else {
      // code 400 means bad request
      res.status(400).json({
        msg: `something is missing | ${error?.message || error} `,
        success: false,
      });
    }
  } catch (error) {
    // code 500 means internal server error
    // console.log(error);

    res.status(500).json({
      msg: error?.message || error,
      success: false,
    });
  }
};

module.exports = { register };
