const mongoose=require('mongoose');
const selectedDb = mongoose.connection.useDb('CN');

const RouteSchema = new mongoose.Schema({
    route_no:{type:String,required:true,unique:true},
    vehicle_no: { type: String, required: true, unique: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'uet_drivers', required: true },
    stops: [{type:mongoose.Schema.Types.ObjectId,ref:'uet_stops'} ]
});


const RouteModel = selectedDb.model('uet_routes', RouteSchema);


module.exports = { RouteModel };