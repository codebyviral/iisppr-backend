import User from "../Models/User.js"

export const getUsers = async (req, res) =>{
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message:'Error fetching users details',
            error:error.message
        });
    }
}
