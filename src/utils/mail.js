
import nodemailer from "nodemailer";
import config from "../config/index.js";

const transporter = nodemailer.createTransport({
  host: config.MAIL.HOST,
  port: Number(config.MAIL.PORT),
  secure: true,
  auth: {
    user: config.MAIL.USER,
    pass: config.MAIL.PASS
  }
});

async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: config.MAIL.USER,
    to,
    subject,
    html
  });
}

export default sendEmail;
