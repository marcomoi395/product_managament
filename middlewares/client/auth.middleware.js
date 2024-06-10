const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const config = require("../../config/process.env");

module.exports.auth = async (req, res, next) => {
    const token = req.cookies.userToken;

    if (token) {
        const userId = jwt.verify(token, config.jwtSecret);
        const user = await User.findOne({
            deleted: false,
            _id: userId.id,
        }).select("-password");
        
        if (user) {
            res.locals.user = user;
        }
    }
    next();
};
