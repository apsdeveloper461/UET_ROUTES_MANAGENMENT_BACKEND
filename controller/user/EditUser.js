
const { decode } = require('jsonwebtoken');
const {UserModel} = require('../../models/User');
const { verifyToken } = require('../jwt-token');
const EditUser = async (req, res) => {
    try {
        const { token } = req.params;
        const { name, phone_no,address } = req.body;
        const isVerify=verifyToken(token);
        if(!isVerify){
            return res.status(401).json({ msg: 'Invalid Token',success:false });
        }
        const id=decode(token).id;
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = name; 
        user.phone_no = phone_no;
        user.address = address;
        await user.save();
        return res.status(200).json({ msg: 'User updated successfully',data:user,success:true });
    } catch (error) {
        return res.status(500).json({ msg: error.message,success:false });
    }
}


module.exports = {EditUser}