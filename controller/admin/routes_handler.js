const { RouteModel } = require("../../models/Route");
const { DriverModel } = require("../../models/Driver");



const add_route=async(req,res)=>{
    try {
        const { route_no,vehicle_no,driver_id,stops_id} = req.body;
       
        if(!route_no|| !vehicle_no || !driver_id || stops_id.length===0){
            return res.status(400).json({msg:"Please fill all fields", success:false});
        }
        // Check if route_no already exists
        const existingRoute = await RouteModel.findOne({ 
            $or:[
                { route_no },
                { driver:driver_id },
                { vehicle_no }
            ]
    });
    
        if (existingRoute) {
            return res.status(400).json({ msg: "Route with this number already exists, driver , vehicle_no", success: false });
        }
        console.log("stops_id",stops_id);
        
        //check the driver is avalibel or not in driver mongoose
        const existdriver=await DriverModel.findById(driver_id);
        if(!existdriver){
            return res.status(400).json({ msg: "Driver not found", success: false });
        }
        existdriver.isAvailable=false;
        
        await existdriver.save();

        const route_data = new RouteModel({
            route_no,
            vehicle_no,
            driver:driver_id,
            stops:stops_id
            
        });
        await route_data.save();

        return res.status(201).json({ msg: "Route added successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
        
    }
}


const update_route=async(req,res)=>{
    try {
        const { route_id,route_no,vehicle_no,driver_id,stops_id} = req.body;
      

        if(!route_no|| !vehicle_no || !driver_id || stops_id.length===0){
            return res.status(400).json({msg:"Please fill all fields", success:false});
        }
        // Check if route_id already exists
        const existingRoute = await RouteModel.findById(route_id);
        if (!existingRoute) {
            return res.status(400).json({ msg: "Route not found", success: false });
        }
        const existingWithSameRouteDetails = await RouteModel.findOne({ 
            $or:[
                { route_no },
                { driver:driver_id },
                { vehicle_no }
            ]
    });
    if (existingWithSameRouteDetails && existingWithSameRouteDetails._id.toString() !== route_id) {
        return res.status(400).json({ msg: "Route with this number already exists, driver , vehicle_no", success: false });
    }
        //check the driver is avalibel or not in driver mongoose
        const existdriver=await DriverModel.findById(driver_id);
        if(!existdriver){
            return res.status(400).json({ msg: "Driver not found", success: false });
        }

        
        // If the driver is changed, set the previous driver's isAvailable to true
        if (existingRoute.driver.toString() !== driver_id) {
            const previousDriver = await DriverModel.findById(existingRoute.driver);
            if (previousDriver) {
                previousDriver.isAvailable = true;
                await previousDriver.save();
            }
        }


        existdriver.isAvailable=false;
        await existdriver.save();
        //update the route
        await RouteModel.findByIdAndUpdate(route_id, {
            route_no,
            vehicle_no,
            driver:driver_id,
            stops:stops_id
        });
        return res.status(201).json({ msg: "Route updated successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
    }
}



const get_routes=async(req,res)=>{
    try {
      
        const routes = await RouteModel.aggregate([
            {
                $lookup: {
                    from: 'uet_drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'driverDetails'
                }
            },
            {
                $lookup: {
                    from: 'uet_stops',
                    localField: 'stops',
                    foreignField: '_id',
                    as: 'stopsDetails'
                }
            },
            {
                $unwind: {
                    path: '$driverDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    driver: {
                        value: '$driverDetails._id',
                        label: '$driverDetails.name',
                        phone:`$driverDetails.phone`
                    },
                    stops: {
                        $map: {
                            input: '$stopsDetails',
                            as: 'stop',
                            in: {
                                value: '$$stop._id',
                                label: '$$stop.name',
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    route_no: 1,
                    vehicle_no: 1,
                    driver: 1,
                    stops: 1
                }
            }
        ]);
        return res.status(200).json({ msg:"fetch data successfully",data:routes, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
        
    }
}


const delelte_route=async(req,res)=>{
    try {
        const {route_id}=req.body;
        if(!route_id){
            return res.status(400).json({msg:"Please provide route id", success:false});
        }
        const existingRoute = await RouteModel.findById(route_id);
        if (!existingRoute) {
            return res.status(400).json({ msg: "Route not found", success: false });
        }
        // If the driver is changed, set the previous driver's isAvailable to true
        const previousDriver = await DriverModel.findById(existingRoute.driver);
        if (previousDriver) {
            previousDriver.isAvailable = true;
            await previousDriver.save();
        }
        await RouteModel.findByIdAndDelete(route_id);
        return res.status(200).json({ msg: "Route deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
    }
}

module.exports={add_route,update_route,get_routes,delelte_route};