
const { DriverModel } = require("../../models/Driver");

const add_driver = async (req, res) => {
  try {
    const { name, email, phone, cnic, address } = req.body;
    if (!name || !email  || !phone || !cnic || !address) {
      return res
        .status(400)
        .json({ msg: "Please fill all fields", success: false });
    }

    // Check if email, phone, route_no, or cnic already exists
    const existingDriver = await DriverModel.findOne({
      $or: [{ email }, { cnic }],
    });
    if (existingDriver) {
      return res
        .status(400)
        .json({
          msg: "Driver with this email or CNIC already exists",
          success: false,
        });
    }
    const driver_data = new DriverModel({
      name,
      email,
      phone,
      cnic,
      address,
    });

    await driver_data.save();

    return res
      .status(201)
      .json({
        msg: "Driver added successfully",
        data: driver_data,
        success: true,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: error.message || "Internal Server Error", success: false });
  }
};

const update_driver = async (req, res) => {
  try {
    const { driver_id, name, email, phone, cnic, address } = req.body;

    if (
      !driver_id ||
      !name ||
      !email ||
      !phone ||
      !cnic ||
      !address
    ) {
      return res
        .status(400)
        .json({ msg: "Please fill all fields", success: false });
    }

    const driver_data = await DriverModel.findById(driver_id);
    if (!driver_data) {
      return res.status(400).json({ msg: "Driver not found", success: false });
    }

    // Check if email, phone, route_no, or cnic already exists
    const existingDriver = await DriverModel.findOne({
      $or: [{ email }, { cnic }],
    });
    if (existingDriver && existingDriver._id.toString() !== driver_id) {
      return res
        .status(400)
        .json({
          msg: "Driver with this email or CNIC already exists",
          success: false,
        });
    }

    driver_data.name = name;
    driver_data.email = email;
    driver_data.phone = phone;
    driver_data.cnic = cnic;
    driver_data.address = address;

    await driver_data.save();

    return res
      .status(200)
      .json({ msg: "Driver updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: error.message || "Internal Server Error", success: false });
  }
};

const get_all_drivers = async (req, res) => {
  try {
    const driver_data = await DriverModel.find().select("-password");
    return res.status(200).json({
      msg: "data fetched successfully",
      data: driver_data,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      msg: error?.message || error,
      success: false,
    });
  }
};
module.exports = { add_driver, update_driver, get_all_drivers };
