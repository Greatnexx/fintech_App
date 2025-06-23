// import nodemailer from 'nodemailer'
import nodemailer from 'nodemailer';


async function sendMail(to, subject, html) {
  try {
    // Create test account
    const testAccount = await nodemailer.createTestAccount();

    // Create a fake SMTP transporter
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: `"D-PAY ENTERPRISE" <${testAccount.user}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(' Email sent (fake):', info.messageId);
    console.log('🔍 Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(' Error sending fake email:', error);
  }
}

export default sendMail;


