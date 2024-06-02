const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

module.exports.auth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        const user = await Account.findOne({
            deleted: false,
            token: token,
        }).select("-password");

        if (!user) {
            res.clearCookie("token");
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        } else {
            const role = await Role.findOne({
                deleted: false,
                _id: user.role_id,
            });

            res.locals.user = user;
            res.locals.role = role;
            next();
        }
    }
};
