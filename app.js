require("dotenv").config();
const express = require("express");
const cors=require('cors')
const app = express();

// get connection function
const DBConnection = require("./controller/Database/DBconnection");

const { router } = require("./api/user_api");
const { router_ad } = require("./api/admin_api");

// apply cors options 
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend's origin
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions))
app.use(express.json());
app.use("/api/user", router);
app.use('/api/admin',router_ad);

// Define routes
app.get("/", (req, res) => {
  res.send("Home | Mehboob Alam");
});

DBConnection()
  .then(() => {
    app.listen(1096, () => {
      console.log("server is running on port 1096");
    });
  })
  .catch((error) => {
    console.log(error);
  });
