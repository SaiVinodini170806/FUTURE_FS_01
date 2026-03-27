import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Debug: check env loaded
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "loaded" : "missing");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "loaded" : "missing");

// mail config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Ready");
  }
});

// API endpoint
app.post("/send-mail", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    console.log("Incoming form data:", { name, email, message });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      info: info.response
    });

  } catch (err) {
    console.error("Email Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// server start
app.listen(3000, () => {
  console.log("Server running on port 3000");
});