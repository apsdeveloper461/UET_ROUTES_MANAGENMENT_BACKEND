const { StopModel } = require("../../models/Stop");
const { verifyToken } = require("../jwt-token");

const add_stop = async (req, res) => {
    try {
        const {  name, latitude,longitude } = req.body;
        if (!name || !latitude || !longitude) {
            return res.status(400).json({ msg: "Please fill all fields", success: false });
        }
      
        const existingStop = await StopModel.findOne({name});
        if (existingStop) {
            return res.status(400).json({ msg: "Stop with this name and already exists", success: false });
        }
        const stop_data = new StopModel({
            name,
            latitude,
            longitude
        });

        await stop_data.save();

        return res.status(201).json({ msg: "Stop added successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
    }
}

const update_stop = async (req, res) => {
    try {
        const {  stop_id, name, latitude,longitude } = req.body;

        
        if (!stop_id || !name || !latitude || !longitude) {
            return res.status(400).json({ msg: "Please fill all fields", success: false });
        }
       
        const existingStop = await StopModel.findById(stop_id);
        if (!existingStop) {
            return res.status(400).json({ msg: "Stop not found", success: false });
        }
        const stop_data = {
            name,
            latitude,
            longitude
        };

        await StopModel.findByIdAndUpdate(stop_id, stop_data);

        return res.status(200).json({ msg: "Stop updated successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
    }
};

const get_all_stops = async (req, res) => {
    try {
        const stops = await StopModel.find();
        return res.status(200).json({ msg: "Stops fetched successfully", data: stops, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
    }
}


const delete_stop = async (req, res) => {
    try {
        const { stop_id } = req.body;
        if (!stop_id) {
            return res.status(400).json({ msg: "Please provide stop id", success: false });
        }
        const stop = await StopModel.findById(stop_id);
        if (!stop) {
            return res.status(400).json({ msg: "Stop not found", success: false });
        }
        await StopModel.findByIdAndDelete(stop_id);
        return res.status(200).json({ msg: "Stop deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", success: false });
    }
}

module.exports = { add_stop, update_stop, get_all_stops, delete_stop };