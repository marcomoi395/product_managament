require("dotenv").config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    bcryptSalt: process.env.BCRYPTSALT,
    client_url: process.env.CLIENT_URL,
};
