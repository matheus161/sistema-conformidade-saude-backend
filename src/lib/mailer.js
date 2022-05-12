const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: `${process.env.HOST_EMAIL}`, // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: process.env.PORT_EMAIL,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL,
    },
});

module.exports = transporter;