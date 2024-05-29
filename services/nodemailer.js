const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.NODEMAILER_APP_PASSWORD,
  },
});

const sendOTPviaMail = async (to, otp) => {
  const mailOptions = {
    from: `"InnoByte Services" <${process.env.GMAIL}>`,
    to: to,
    subject: "Welcome to InnoByte Services",
    html: `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your Email</title>
    </head>
    <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
            <tbody>
                <tr>
                    <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                        <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                            <tbody>
                                <tr>
                                    <td style="padding: 40px 0px 0px;">
                                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                                            <div style="color: rgb(0, 0, 0); text-align: left;">
                                                <h1 style="margin: 1rem 0">Verification code</h1>
                                                <p style="padding-bottom: 16px">Please use the verification code below to verify.</p>
                                                <p style="font-size: 130%; text-align: center; color: #007bff; padding: 20px; margin: 10px 0; font-weight: bold;">${otp}</p>
                                                <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                                                <p style="padding-bottom: 16px">Thanks,<br>InnoByte Services team</p>
                                            </div>
                                        </div>
                                        <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                                            <img src="https://media.licdn.com/dms/image/D560BAQGqQE-xTODoGA/company-logo_200_200/0/1708108358962/innobyte_services_logo?e=2147483647&v=beta&t=AKYAufKyxX7Li2E6V6y5iB9B3mDod4Wg8RVpCFLBzvU" alt="InnoByte Services Logo" style="width: 100px; height: auto;">
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>`,
    replyTo: "no-reply@innobyteservices.com",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendOTPviaMail };
