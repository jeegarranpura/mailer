const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// email
const dns = require("dns");
const nodemailer = require("nodemailer");

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  // host: "smtp.gmail.com",
  service: 'gmail',
  port: 587,
  secure: false, // REQUIRED for 587
  auth: {
    user: process.env.USER,
    pass: process.env.PASS, // your generated app password
  }
});

router.get("/home", getHome);
router.post("/sendMails", sendMails);

async function getHome(req, res, next) {
  try {
    res.json("Welcome Homes");
  } catch (error) {
    console.log("   error");
  }
}

const contactPageTemplate = (
  name,
  email,
  message,
  subject,
) => {
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      padding: 0;
      margin: 0;
      color: #222;
    "
  >
    <table
      align="center"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="
        max-width: 650px;
        background-color: #ffffff;
        margin: 0 auto;
        border-radius: 8px;
        overflow: hidden;
      "
    >
      <tr>
        <td style="padding: 25px">
          <p>Dear Admin</p>

          <h3 style="color: #333">Contact Inquiry Received</h3>
          <div
            style="
              background: #fafafa;
              border: 1px dashed #dde2ea;
              border-radius: 6px;
              padding: 12px;
            "
          >
            <p>
              <b>Name:</b> ${name ? name : "-"}<br />
              <b>Email:</b> ${email ? email : "-"}<br />
              <b>Subject:</b> ${subject ? subject : "-"}<br />
            </p>
            <p>
              <b>Message:</b><br />
              <span style="white-space: pre-line"
                >${message ? message : "-"}</span
              >
            </p>
            <br />
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

const thankYouMailTemplate = (email) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2 style="color:#1e88e5;">Thank you${email ? ", " + email : ""}!</h2>
      <p>
        We have received your inquiry and our team will get back to you as soon as possible.<br/>
        We appreciate your interest and will respond at the earliest opportunity.
      </p>
      <br/>
      <p style="font-size: 13px; color: #888;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  `;
};

async function sendMails(req, res, next) {
  try {
    const { name, email, message, subject } = req.body;

    const mailOptions = {
      from: "jeegarnodejs.aegis@gmail.com",
      to: "jigar.ranpura99@gmail.com",
      subject: "Contact inquiry",
    //   attachments: attachments,
      html: contactPageTemplate(
        name,
        email,
        message,
        subject,
      ),
    };
    // const mailOptionThanks = {
    //   from: "jeegarnodejs.aegis@gmail.com",
    //   to: email,
    //   subject: "Thank you for contact inquiry",
    //   html: thankYouMailTemplate(name),
    // };

    const info = await transporter.sendMail(mailOptions);
    // const info2 = await transporter.sendMail(mailOptionThanks);
    return res.status(200).json(info);
  } catch (error) {
    console.error("MAIL ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}


module.exports = router;
