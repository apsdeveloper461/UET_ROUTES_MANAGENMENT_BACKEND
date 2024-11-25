const mongoose = require('mongoose');

const selectedDb = mongoose.connection.useDb('UET_SYSTEM');

const StopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
});

const StopModel = selectedDb.model('uet_stops', StopSchema);

module.exports = { StopModel };