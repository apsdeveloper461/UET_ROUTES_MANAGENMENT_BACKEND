const { RouteModel } = require("../../models/Route");
const { DriverModel } = require("../../models/Driver");
const {StopModel} = require("../../models/Stop");
const { verifyToken } = require("../jwt-token");



const add_route=async(req,res)=>{
    try {
        const { route_no,vehicle_no,driver_id} = req.body;
       
        if(!route_no|| !vehicle_no || !driver_id){
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
            driver:driver_id
            
        });
        route_data.save();
        return res.status(201).json({ msg: "Route added successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
        
    }
}


const update_route=async(req,res)=>{    
    try {
        const { route_id,route_no,vehicle_no,driver_id} = req.body;
      
        if(!route_id || !route_no || !driver_id){
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
    if(existingWithSameRouteDetails._id.toString()!==route_id){
        return res.status(400).json({ msg: "Route with this number already exists, driver , vehicle_no", success: false });
    }
        //check the driver is avalibel or not in driver mongoose
        const existdriver=await DriverModel.findById(driver_id);
        if(!existdriver){
            return res.status(400).json({ msg: "Driver not found", success: false });
        }
        existdriver.isAvailable=false;
        await existdriver.save();
        //update the route
        await RouteModel.findByIdAndUpdate(route_id, {
            route_no,
            vehicle_no,
            driver:driver_id
        });
        return res.status(201).json({ msg: "Route updated successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
    }
}


const remove_stop_from_route=async(req,res)=>{
    try {
        const {token, route_id,stop_id} = req.body;
        if(!token){
            return res.status(400).json({msg:"Token not found", success:false});
        }
        const isValidToken=verifyToken(token);
        if(!isValidToken){
            return res.status(400).json({msg:"Token not valid", success:false});
        }   
        if(!route_id || !stop_id){
            return res.status(400).json({msg:"Please fill all fields", success:false});
        }
        // Check if route_id already exists
        const existingRoute = await RouteModel.findById(route_id);
        if (!existingRoute) {
            return res.status(400).json({ msg: "Route not found", success: false });
        }
        //check the stop is avalibel or not in stop mongoose
        const existstop=await StopModel.findById(stop_id);
        if(!existstop){
            return res.status(400).json({ msg: "Stop not found", success: false });
        }
        //remove the stop from the route
        await RouteModel.findByIdAndUpdate(route_id, {
            $pull: { stops: stop_id }
        });
        return res.status(201).json({ msg: "Stop removed successfully", success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
        
    }
}


const add_stop_to_route=async(req,res)=>{
    try {
        const {token, route_id,stop_id} = req.body;
        if(!token){
            return res.status(400).json({msg:"Token not found", success:false});
        }
        const isValidToken=verifyToken(token);
        if(!isValidToken){
            return res.status(400).json({msg:"Token not valid", success:false});
        }   
        if(!route_id || !stop_id){
            return res.status(400).json({msg:"Please fill all fields", success:false});
        }
        // Check if route_id already exists
        const existingRoute = await RouteModel.findById(route_id);
        if (!existingRoute) {
            return res.status(400).json({ msg: "Route not found", success: false });
        }
        //check the stop is avalibel or not in stop mongoose
        const existstop=await StopModel.findById(stop_id);
        if(!existstop){
            return res.status(400).json({ msg: "Stop not found", success: false });
        }
        //add the stop to the route
        await RouteModel.findByIdAndUpdate(route_id, {
            $push: { stops: stop_id }
        });
        return res.status(201).json({ msg: "Stop added successfully", success: true });
    }
    catch (error) {
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
              $project: {
                _id: 1,
                route_no: 1,
                vehicle_no: 1,
                driver: '$driverDetails',
                stops: '$stopsDetails'
              }
            }
          ])
        return res.status(200).json({ msg:"fetch data successfully",data:routes, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
        
    }
}


module.exports={add_route,update_route,remove_stop_from_route,add_stop_to_route,get_routes};