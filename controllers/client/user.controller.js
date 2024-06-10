const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgotPassword.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const config = require("../../config/process.env");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/email/sendEmail");

// GET /register
module.exports.register = async (req, res) => {
    if (res.locals.user) {
        res.redirect(`/`);
        return;
    }

    res.render("client/pages/user/register", {
        pageTitle: "Register",
    });
};

// POST /register
module.exports.registerPost = async (req, res) => {
    const data = req.body;

    try {
        // Check if email already exists
        const emailExist = await User.findOne({
            deleted: false,
            email: data.email,
        });

        if (emailExist) {
            // If email exists, flash error message and redirect back
            req.flash("error", "Email already exists");
            res.redirect("back");
            return;
        }

        // Hash the password using bcrypt with salt from config
        data.password = await bcrypt.hash(
            data.password,
            Number(config.bcryptSalt),
        );

        // Create a new user with the provided data
        const newUser = new User(data);

        // Generate a JWT token for the new user
        let token = jwt.sign({ id: newUser.id }, config.jwtSecret);

        // Set the JWT token as a cookie
        res.cookie("userToken", token);

        // Save the new user to the database
        await newUser.save();

        // Flash success message and redirect to the home page
        req.flash("success", "Successfully created account");
        res.redirect("/");
    } catch (e) {
        req.flash("error", "Error");
        res.redirect("/");
    }
};

// GET /logout
module.exports.logout = async (req, res) => {
    res.clearCookie("userToken");
    req.flash("success", "Logout successfully");
    res.redirect(`/user/login`);
};

// GET /login
module.exports.login = async (req, res) => {
    if (res.locals.user) {
        res.redirect(`/`);
        return;
    }

    res.render("client/pages/user/login", {
        pageTitle: "Login",
    });
};

// POST /login
module.exports.loginPost = async (req, res) => {
    const data = req.body;
    const email = data.email;
    const password = data.password;

    try {
        // Find user by email where the account is not deleted
        const user = await User.findOne({
            deleted: false,
            email: data.email,
        });

        // If user not found, flash error message and redirect back
        if (!user) {
            req.flash("error", "Email does not exist");
            res.redirect("back");
            return;
        }

        // Compare provided password with the stored hashed password
        const isVerify = await bcrypt.compare(password, user.password);

        // If password is incorrect, flash error message and redirect back
        if (!isVerify) {
            req.flash("error", "Password is not correct");
            res.redirect("back");
            return;
        }

        // If account is inactive, flash error message and redirect back
        if (user.status === "inactive") {
            req.flash("error", "Account has been locked");
            res.redirect("back");
            return;
        }

        // Generate JWT token
        const expiresIn = 31536000; // Token expiration time in seconds (1 year)
        const token = jwt.sign({ id: user.id }, config.jwtSecret);

        // If "remember me" is checked, set a cookie with an expiration date
        if (data.rememberMe) {
            res.cookie("userToken", token, {
                maxAge: Date.now() + expiresIn,
                httpOnly: true,
                secure: true,
            });
        } else {
            // If "remember me" is not checked, set a session cookie
            res.cookie("userToken", token);
        }

        // Flash success message and redirect to the home page
        req.flash("success", "Login successfully");
        res.redirect(`/`);
    } catch (e) {
        req.flash("error", "Error. Try again!");
        res.redirect(`/`);
    }
};

// GET /password/forgot
module.exports.forgotPassword = async (req, res) => {
    if (req.cookies.userToken) {
        res.redirect(`/`);
        return;
    }

    res.render("client/pages/user/forgot-password", {
        pageTitle: "Reset Password",
    });
};

// POST /password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const data = req.body;

    try {
        // Find the user by email, excluding the password field from the result
        const user = await User.findOne({
            deleted: false,
            email: data.email,
        }).select("-password");

        if (!user) {
            // If user does not exist, flash error message and redirect back
            req.flash("error", "Email does not exist");
            res.redirect("back");
            return;
        }

        // Check if there is an existing token for the user and delete it if found
        let token = await ForgotPassword.findOne({ userId: user._id });
        if (token) await token.deleteOne();

        // Generate a new reset token and hash it
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(config.bcryptSalt));

        // Save the new token with an expiration time
        await new ForgotPassword({
            userId: user.id,
            token: hash,
            expireAfterSeconds: Date.now(),
        }).save();

        // Create the password reset link
        const link = `${config.client_url}/user/password/reset?token=${resetToken}&id=${user._id}`;

        // Send email to user with the reset link
        sendEmail(
            user.email,
            "Password Reset Request",
            {
                name: user.fullName,
                link: link,
            },
            "./template/requestResetPassword.handlebars",
        );

        // Render the check-your-email page
        res.render("client/pages/user/check-your-email", {
            pageTitle: "Check your Email",
        });
    } catch (e) {
        req.flash("error", "Error, Try again");
        res.redirect("/");
    }
};

// GET /password/reset
module.exports.resetPassword = async (req, res) => {
    const data = req.query;

    res.render("client/pages/user/reset-password", {
        pageTitle: "Reset Password",
        data: data,
    });
};

// POST /password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const data = req.body;

    // Check if password and confirmPassword match
    if (data.password !== data.confirmPassword) {
        req.flash("error", "Passwords do not match");
        res.redirect("back");
        return;
    }

    try {
        // Find the password reset token for the given user ID
        const passwordResetToken = await ForgotPassword.findOne({
            userId: data.id,
        });

        // If no token is found, flash error message and redirect to forgot password page
        if (!passwordResetToken) {
            req.flash("error", "Invalid or expired password reset token");
            res.redirect("/user/password/forgot");
            return;
        }

        // Compare provided token with the stored hashed token
        const isValid = await bcrypt.compare(
            data.token,
            passwordResetToken.token,
        );

        // If the token is invalid or expired, flash error message and redirect to forgot password page
        if (!isValid) {
            req.flash("error", "Invalid or expired password reset token");
            res.redirect("/user/password/forgot");
            return;
        }

        // Hash the new password
        const hash = await bcrypt.hash(
            data.password,
            Number(config.bcryptSalt),
        );

        // Update the user's password in the database
        await User.updateOne(
            { _id: data.id },
            { $set: { password: hash } },
            { new: true },
        );

        // Generate a new JWT token for the user
        let token = jwt.sign({ id: data.id }, config.jwtSecret);

        // Set the JWT token as a cookie
        res.cookie("userToken", token);

        // Flash success message and redirect to home page
        req.flash("success", "Reset password successfully");
        res.redirect("/");
    } catch (e) {
        // In case of any errors, flash error message and redirect to forgot password page
        req.flash("error", "Invalid or expired password reset token");
        res.redirect("/user/password/forgot");
    }
};
