const mongoose = require('mongoose');
const { generatedate } = require('../controller/generate-date');


const selectedDb=mongoose.connection.useDb("UET_SYSTEM");



const ComplaintSchema = new mongoose.Schema({
    registration_no:{
        type:String,
        required:true
    },
    complaint_description:{
        type:String,
        required:true
    },
    isSolved:{
        type:Boolean,
        default:false
    },
    date:{
        type:String,
        default:generatedate()
    }
})

const  ComplaintModel=selectedDb.model('uet_complaints',ComplaintSchema);


module.exports={ComplaintModel}