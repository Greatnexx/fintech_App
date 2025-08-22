// import nodemailer from 'nodemailer'
import nodemailer from 'nodemailer';

async function sendMail(to, subject, html) {
  try {
    // Create test account with etheral
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
    //  eslint-disable-next-line no-console
    console.log(' Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export default sendMail;

