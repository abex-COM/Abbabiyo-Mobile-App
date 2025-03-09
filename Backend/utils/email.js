require("dotenv").config(); // Load environment variables from .env file
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // 1) Create transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use Gmail service
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail app password (not the account password)
      },
    });

    // 2) Define email options
    const mailOptions = {
      subject: options.subject,
      from: "Attenzo.com",
      to: options.email, // Receiver address
      subject: options.subject, // Subject of the email
      text: options.message, // Plain text message
    };

    // 3) Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
