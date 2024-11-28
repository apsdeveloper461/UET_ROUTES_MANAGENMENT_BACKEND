const express=require("express");
const { logIn_ad } = require("../controller/admin/logIn_ad");
const { changePassword_ad } = require("../controller/admin/changePassword_ad");
const { getDataOfAdmin } = require("../controller/admin/getData_ad");
const { register_ad } = require("../controller/admin/register_ad");
const { add_stop, update_stop, get_all_stops } = require("../controller/admin/stops_handler");
const { add_driver, update_driver, get_all_drivers } = require("../controller/admin/driver_handler");
const { add_route, get_routes, add_stop_to_route, remove_stop_from_route, update_route } = require("../controller/admin/routes_handler");
const { Change_Complaint_Status, getAllComplaints, deleteComplaint } = require("../controller/admin/complaint_handler");
const { router } = require("./user_api");
const router_ad=express.Router();




router_ad.post('/login',logIn_ad);
router_ad.post('/register',register_ad)
router_ad.get('/',getDataOfAdmin);
router_ad.post('/change-password',changePassword_ad)


// stops api
router_ad.post('/stop/add-stop',add_stop);
router_ad.post('/stop/update-stop',update_stop);
router_ad.get('/stop',get_all_stops);


//driver api
router_ad.post('/driver/add-driver',add_driver);
router_ad.post('/driver/update-driver',update_driver);
router_ad.get('/driver',get_all_drivers);


//routes api

router_ad.post('/route/add-route',add_route);
router_ad.post('/route/update-route',update_route);
router_ad.post('/route/add-stop-to-route',add_stop_to_route);
router_ad.post('/route/remove-stop-from-route',remove_stop_from_route);
router_ad.get('/route',get_routes);



//complaint api

router_ad.get('/complaint',getAllComplaints)
router_ad.post('/complaint/update-status',Change_Complaint_Status)
router_ad.post('/complaint/delete',deleteComplaint)

module.exports={router_ad}