require("dotenv").config();
const express = require("express");
const cors=require('cors')
const http=require('http')
const {setupSockets}=require('./socket')
const app = express();
const server=http.createServer(app)
// get connection function
const DBConnection = require("./controller/Database/DBconnection");

const { router } = require("./api/user_api");
const { router_ad } = require("./api/admin_api");
const { router_dr } = require("./api/driver_api");

// apply cors options 
const corsOptions = {
  origin:'*',// Replace with your frontend's origin
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions))
app.use(express.json());
app.use("/api/user", router);
app.use('/api/admin',router_ad);
app.use('/api/driver',router_dr);

// Define routes
app.get("/", (req, res) => {
  res.send("Home | Mehboob Alam");
});

// Setup socket connections
setupSockets(server);


DBConnection()
  .then(() => {
    server.listen(1096, () => {
      console.log("server is running on port 1096");
    });
  })
  .catch((error) => {
    console.log(error);
  });
