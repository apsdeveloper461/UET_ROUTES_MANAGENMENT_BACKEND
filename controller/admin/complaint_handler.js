const { ComplaintModel } = require("../../models/Complaint");

const Change_Complaint_Status = async (req, res) => {
    try {
        const { token,complaint_id } = req.body;
        if (complaint_id) {
            const complaint = await ComplaintModel.findOne({ _id: complaint_id });
            if (complaint) {
                complaint.isSolved = complaint.isSolved ? false : true;
                await complaint.save();
                res.status(200).json({
                    msg: "complaint status updated",
                    complaint: complaint,
                    success: true
                })
            }
            else {
                res.status(400).json({
                    msg: "complaint not found",
                    success: false
                })
            }
        }
        else {
            res.status(400).json({
                msg: "something is missing",
                success: false
            })
        }
    }
    catch (error) {
        res.status(500).json({
            msg: error?.message || error,
            success: false
        })
    }
}


const getAllComplaints = async (req, res) => {
    try {
        const complaints = await ComplaintModel.find();
        res.status(200).json({
            complaints: complaints,
            success: true
        })
    }
    catch (error) {
        res.status(500).json({
            msg: error?.message || error,
            success: false
        })
    }
}

const deleteComplaint = async (req, res) => {
    try {
        const { complaint_id } = req.body;
        if (complaint_id) {
            const complaint = await ComplaintModel.deleteOne({ _id: complaint_id });
            if (complaint.deletedCount) {
                
                    res.status(200).json({
                    msg: "complaint deleted",
                    success: true
                })
            }
            else {
                res.status(400).json({
                    msg: "complaint not found",
                    success: false
                })
            }
        }
        else {
            res.status(400).json({
                msg: "something is missing",
                success: false
            })
        }
    }
    catch (error) {
        res.status(500).json({
            msg: error?.message || error,
            success: false
        })
    }
}


module.exports = { Change_Complaint_Status,getAllComplaints,deleteComplaint }