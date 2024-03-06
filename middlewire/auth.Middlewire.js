const jwt = require('jsonwebtoken');
const Users = require("../models/user.model");
const isauth = async(req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(400).json({ message: "please Login" });
        const { id } = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findById(id);
        req.user = user;
        next();
    } catch (error) {
        console.log(`error in get user api ${error}`.bgRed)
        return res.status(500).json({
            success: false,
            message: "Un_authorised User Please login"
        })
    }
}
module.exports = isauth;