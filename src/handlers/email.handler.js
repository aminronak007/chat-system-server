const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

class EmailHandler {
  async sendEmail(email, body, subject, cc = "", attachments = []) {
    try {
      const transporter = nodemailer.createTransport(
        smtpTransport({
          host: process.env.SMTP_HOST,
          secure: false,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
      );

      transporter.verify((error, success) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages.");
          console.log(success);
        }
      });

      const mailOptions = {
        from: process.env.SMTP_MAIL_FROM,
        to: email,
        subject,
        html: body,
      };

      if (attachments.length > 0) {
        mailOptions["attachments"] = attachments;
      }
      if (cc != "") {
        mailOptions["cc"] = cc;
      }

      await transporter.sendEmail(mailOptions).then(
        (result) => {
          console.log("Email success:: ", result);
          return result;
        },
        (error) => {
          console.log("Email error:: ", error);
          return error;
        }
      );
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

let emailHandler = new EmailHandler();
module.exports = {
  sendEmail: emailHandler.sendEmail,
};
