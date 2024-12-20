require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const DBConnection = require("./controller/Database/DBconnection");

const { router } = require("./api/user_api");
const { router_ad } = require("./api/admin_api");
const { router_dr } = require("./api/driver_api");
const { decodeToken } = require("./controller/jwt-token");
const { DriverModel } = require("./models/Driver");
const { RouteModel } = require("./models/Route");
const pusher = require("./pusher");
const http = require("http");
const { Server } = require("socket.io");
const chatHandler = require("./chatHandler");
const { UserModel } = require("./models/User");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend's origin
    methods: ["GET", "POST"],
  },
});

chatHandler(io);

// apply cors options
const corsOptions = {
  origin: "*", // Replace with your frontend's origin
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/user", router);
app.use("/api/admin", router_ad);
app.use("/api/driver", router_dr);

app.get("/get/users-drivers",async(req,res)=>{
  try { 
    console.log("here");
    
      const users=await UserModel.find();
      const drivers=await DriverModel.find();
      res.status(200).json({data:{users,drivers},success:true})
  } catch (error) { 
    console.log("Heere",error);
    
      res.status(500).json({msg:"Internal server error",success:false})
  }

})
// Define routes
app.get("/", (req, res) => {
  res.send("Home | Mehboob Alam");
});

// Driver locations storage
const RoutesLocation = [];

// Endpoint for a driver to send initial location or updated location
app.post("/", async (req, res) => {
  try {
    const { token, location } = req.body;
    console.log("Location routres", RoutesLocation);
    const { id } = decodeToken(token);
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token." });
    }
    const driver_data = await DriverModel.findById(id);
    if (!driver_data) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token." });
    }

    const route = await RouteModel.findOne({ driver: driver_data._id });
    if (!route) {
      return res
        .status(400)
        .json({ success: false, message: "Route not found." });
    }
    const idx = RoutesLocation.findIndex(
      (item) => item.driver_id.toString() === id
    );
    if (idx === -1) {
      RoutesLocation.push({
        driver_id: driver_data._id,
        id: route._id,
        name: route.route_no,
        location: { latitude: 31.6943, longitude: 74.2472 },
      });
    } else {
      RoutesLocation[idx].location.latitude = location?.latitude;
      RoutesLocation[idx].location.longitude = location?.longitude;
    }
    pusher.trigger("location-channel", "location-update", RoutesLocation);

    res.json({ success: true, message: "Location updated successfully." });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Error is happening." });
  }

  
});


app.get("/api/routes-by-stop/:stop_id", async (req, res) => {
  try {
    const { stop_id } = req.params;
    const routes = await RouteModel.find({ stops : { $in: [stop_id] } }).select("_id route_no");

  // console.log("routes", routes);
  

    const routeDetails = routes.map(route => ({
      id: route._id,
      name: route.route_no
    }));

    res.status(200).json({ success: true, routes: routeDetails });
  } catch (error) {
    return res.status(500).json({ success: false, message: "An error occurred while fetching routes." });
  }
});



DBConnection()
  .then(() => {
    server.listen(30781, () => {
      console.log("server is running on port 30781");
    });
  })
  .catch((error) => {
    console.log(error);
  });
