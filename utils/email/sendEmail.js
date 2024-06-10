const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const config = require("../../config/process.env");

const sendEmail = async (email, subject, payload, template) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email,
                pass: config.password,
            },
        });

        const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        const compiledTemplate = handlebars.compile(source);
        const options = () => {
            return {
                from: config.email,
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };

        // Send email
        await transporter.sendMail(options(), (error, info) => {
            if (error) {
                console.log("err");
            } else {
                console.log("ok");
            }
        });
    } catch (error) {
        return error;
    }
};

module.exports = sendEmail;
