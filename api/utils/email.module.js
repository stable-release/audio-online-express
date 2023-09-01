require("dotenv").config();
const { NODEMAILER_KEY, NODEMAILER_HOST, NODEMAILER_EMAIL } = process.env;
const nodemailer = require("nodemailer");

async function sendCode(to, subject, code) {
    const transporter = nodemailer.createTransport({
        service: NODEMAILER_HOST,
        auth: {
            user: NODEMAILER_EMAIL,
            pass: NODEMAILER_KEY,
        }
    });
    
    const emailParams = {
        to: `${to}`,
        subject: `${subject}`,
        html: `Verfication Code:<br><strong>${code}</strong> <br> If you think you recieved this message in error, please ignore this email.`,
    };
    
    transporter.sendMail(emailParams, (error, info) => {
        if (error) {
            const error = new Error(`${error}`);
            error.status = 404;
            throw error;
        } else {
            return (`${info.response}`)
        }
    });
}

module.exports = {
    sendCode,
}