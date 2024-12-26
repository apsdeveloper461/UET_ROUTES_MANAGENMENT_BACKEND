const mongoose = require("mongoose");
const selectedDb = mongoose.connection.useDb('CN');
const { MessageModel } = require('./Messages'); // Ensure correct import

const chatSchema = new mongoose.Schema({
     sender: { 
           type: mongoose.Schema.Types.ObjectId, 
           refPath: 'senderModel' 
       },
       senderModel: {
           type: String,
           enum: ['uet_users', 'uet_drivers']
       },
       receiver: { 
           type: mongoose.Schema.Types.ObjectId, 
           refPath: 'receiverModel' 
       },
       receiverModel: {
           type: String,
           enum: ['uet_users', 'uet_drivers']
       },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'uet_messages' }]
});

chatSchema.statics.findOrCreateChat = async function(sender, senderModel, receiver, receiverModel, messageContent) {
    let chat = await this.findOne({ 
        $or: [
            { sender, senderModel, receiver, receiverModel },
            { sender: receiver, senderModel: receiverModel, receiver: sender, receiverModel: senderModel }
        ]
    });
    if (!chat) {
        chat = new this({ sender, senderModel, receiver, receiverModel, messages: [] });
    }
    const message = new MessageModel({ sender, senderModel, message: messageContent });
    await message.save();
    chat.messages.push(message._id);
    await chat.save();

    const populatedChat = await this.aggregate([
        { $match: { _id: chat._id } },
        {
            $lookup: {
                from: 'uet_messages',
                localField: 'messages',
                foreignField: '_id',
                as: 'messages'
            }
        }
    ]).exec();

    return populatedChat[0];
};

chatSchema.statics.syncChat = async function(chatId) {
    const chat = await this.findById(chatId)
    
    const populatedChat = await this.aggregate([
        { $match: { _id: chat._id } },
        {
            $lookup: {
                from: 'uet_messages',
                localField: 'messages',
                foreignField: '_id',
                as: 'messages'
            }
        }
    ]).exec();

    return populatedChat[0];
};
chatSchema.statics.syncChats = async function(sender,receiver) {
    const chat = await this.findOne({
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender }
        ]
    });
    
    const populatedChat = await this.aggregate([
        { $match: { _id: chat._id } },
        {
            $lookup: {
                from: 'uet_messages',
                localField: 'messages',
                foreignField: '_id',
                as: 'messages'
            }
        }
    ]).exec();

    return populatedChat[0];
};

chatSchema.statics.getAllChatsForUser = async function(userId) {
    const chats = await this.aggregate([
        {
            $match: {
                $or: [
                    { sender: new mongoose.Types.ObjectId(userId) },
                    { receiver: new mongoose.Types.ObjectId(userId) }
                ]
            }
        },
        {
            $lookup: {
                from: 'uet_messages',
                localField: 'messages',
                foreignField: '_id',
                as: 'messages'
            }
        },
        {
            $addFields: {
                messages: { $sortArray: { input: '$messages', sortBy: { createdAt: -1 } } }, // Sort messages by createdAt in descending order
                lastMessage: { $arrayElemAt: ['$messages',0] }, // Get the first element after sorting
                unreadMessagesCount: {
                    $size: {
                        $filter: {
                            input: '$messages',
                            as: 'message',
                            cond: { $and: [{ $ne: ['$$message.sender', new mongoose.Types.ObjectId(userId)] }, { $ne: ['$$message.isread', true] }] }
                        }
                    }
                },
                otherMember: {
                    $cond: {
                        if: { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
                        then: { id: '$receiver', model: '$receiverModel' },
                        else: { id: '$sender', model: '$senderModel' }
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'uet_users',
                localField: 'otherMember.id',
                foreignField: '_id',
                as: 'otherMemberUserInfo'
            }
        },
        {
            $lookup: {
                from: 'uet_drivers',
                localField: 'otherMember.id',
                foreignField: '_id',
                as: 'otherMemberDriverInfo'
            }
        },
        {
            $addFields: {
                otherMemberInfo: {
                    $cond: {
                        if: { $eq: ['$otherMember.model', 'uet_users'] },
                        then: { $arrayElemAt: ['$otherMemberUserInfo', 0] },
                        else: { $arrayElemAt: ['$otherMemberDriverInfo', 0] }
                    }
                }
            }
        },
        {
            $addFields: {
                'otherMember.username': '$otherMemberInfo.username',
                'otherMember.email': '$otherMemberInfo.email'
            }
        },
        {
            $project: {
                messages: 0,
                otherMemberUserInfo: 0,
                otherMemberDriverInfo: 0,
                otherMemberInfo: 0
            }
        }
    ]);

    
    return chats;
};

chatSchema.statics.markMessagesAsRead = async function(chatId, userId) {
    const chats = await this.findById(chatId)
    const populatedChat = await this.aggregate([
        { $match: { _id: chats._id } },
        {
            $lookup: {
                from: 'uet_messages',
                localField: 'messages',
                foreignField: '_id',
                as: 'messages'
            }
        }
    ]).exec();

    const chat=populatedChat[0];
    
    if (chat) {
        for (let message of chat.messages) {
            if (message.sender.toString() !== userId.toString() && !message.isread) {
                message.isread = true;
                await MessageModel.findByIdAndUpdate(message._id, { isread: true });
            }
        }
    }
};

exports.ChatModel = selectedDb.model('uet_chats', chatSchema);