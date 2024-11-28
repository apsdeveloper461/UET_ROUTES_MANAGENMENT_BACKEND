const { ComplaintModel } = require("../../models/Complaint");

const createComplaint = async (req, res) => {

    try {
        const { registration_no, complaint_description } = req.body;
        if (registration_no && complaint_description) {
            
            const complaint = await ComplaintModel.create({
                registration_no,
                complaint_description
            })
            res.status(201).json({
                msg: "complaint send successfully",
                complaint:complaint,
                success: true,
            })
        }
        else {
            res.status(400).json({
                msg: `something is missing | ${error?.message || error} `,
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
module.exports = { createComplaint }