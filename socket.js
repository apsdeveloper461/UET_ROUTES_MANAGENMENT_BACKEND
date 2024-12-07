const { Server } = require("socket.io");
const { decodeToken } = require("./controller/jwt-token");
const { DriverModel } = require("./models/Driver");
const { RouteModel } = require("./models/Route");
const RoutesLocation = [];
const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    //   console.log("A user connected:", socket.id);

    //driver data get and from driver watch route , if drivver assign route then push to routesloactions
    socket.on("driver_id", async ({token}) => {
      try {
        // console.log(token);
        const { id } = decodeToken(token);
        console.log(id,"id");        
        const driver_data = await DriverModel.findById(id);
        if (!driver_data) {
          return;
        }
        // console.log(driver_data);
        const route = await RouteModel.findOne({driver:driver_data._id });
        if (!route) {
          return;
        }
        const idx = RoutesLocation.findIndex((item) => item.driver_id.toString() === id);
        if(idx===-1) {
            RoutesLocation.push({
                driver_id: driver_data._id,
              id: route._id,
              name: route.route_no,
              location: {latitude:31.6943,longitude:74.2472},
            })
        }
        // console.log(route);
        // console.log(RoutesLocation,typeof(RoutesLocation));
        
      } catch (error) {
        console.log(error,"Error is happening");
      }
    });
    socket.on("getRouteArray",()=>{
        console.log("RoutesLocation",RoutesLocation);
        socket.emit("sendLoactionToViewer", RoutesLocation);
    })




 // Handle location updates from drivers
 socket.on("driverLocation", (data) => {
     try {
         const { token, location } = data;
         const { id } = decodeToken(token);
        const routeIndex = RoutesLocation.findIndex(route => route.driver_id.toString() === id);
        if (routeIndex === -1) {
            console.error("Unauthorized driver or invalid token.");
            return;
        }
        RoutesLocation[routeIndex].location.latitude = location?.latitude;
        RoutesLocation[routeIndex].location.longitude = location?.longitude;
            console.log(`Location updated for driver :`, location);
        //  if(!RoutesLocation[id]){
        //      console.error("Unauthorized driver or invalid token.");
        //      return;
        //  }
        //  console.log("RoutesLocation[id]",typeof(RoutesLocation),RoutesLocation.length);
        //     RoutesLocation[id].location.latitude = location?.latitude;
        //     RoutesLocation[id].location.longitude = location?.longitude;
            
    // io.emit("sendLoactionToViewer", RoutesLocation);
        } catch (error) {
            console.log("Error is happening");
        }
    })
    // setInterval(() => {
        console.log("RoutesLocation",RoutesLocation);
        
        io.emit("sendLoactionToViewer", RoutesLocation);
    // }, 5000);
    // socket.emit("sendLoactionToViewer", RoutesLocation);


    // Emit event to get driver ID
    // socket.emit('getDriverId');

    // // Listen for driver ID
    // socket.on('driverId', (id) => {
    //   socket.driverId = id;
    //   console.log(`Driver ID received: ${id}`);
    // });

    // // Listen for location updates
    // socket.on('locationUpdate', (data) => {
    //   const room = `location_${data.driverId}`;
    //   socket.join(room);
    //   io.to(room).emit('locationUpdate', data);
    //   console.log(`Location update sent to room ${room}:`, data);
    // });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};

module.exports = { setupSockets };
