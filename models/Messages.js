const mongoose = require("mongoose");
const selectedDb = mongoose.connection.useDb('CN');

const messageSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'senderModel' 
    },
    senderModel: {
        type: String,
        enum: ['uet_users', 'uet_drivers']
    },
    message: { type: String },
    timestamp: { type: Date, default: Date.now },
    isread: { type: Boolean, default: false }
});

const MessageModel = selectedDb.model('uet_messages', messageSchema);

module.exports = { MessageModel };