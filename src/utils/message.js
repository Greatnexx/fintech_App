export const otpMessage = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification - D-PAY ENTERPRISE</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
      <style>
        body {
          background-color: #f4f4f8;
          font-family: 'Inter', sans-serif;
          padding: 0;
          margin: 0;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 30px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .logo {
          text-align: center;
          margin-bottom: 25px;
        }
        .logo img {
          height: 50px;
        }
        .header {
          text-align: center;
          color: #1d3262;
        }
        .otp-box {
          margin: 30px auto;
          background-color: #f1f4fb;
          border: 1px dashed #1d3262;
          color: #1d3262;
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          padding: 16px;
          border-radius: 8px;
          letter-spacing: 2px;
          width: 200px;
        }
        .content {
          font-size: 15px;
          color: #333;
          margin-top: 20px;
          line-height: 1.6;
        }
        .content strong {
          color: #1d3262;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="logo">
          <img src="https://your-logo-url.com/logo.png" alt="Swift_Pay Logo" />
        </div>
        <div class="header">
          <h2>Verify Your Email Address</h2>
        </div>
        <div class="content">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for signing up with <strong>D-PAY ENTERPRISE</strong>.</p>
          <p>Please use the OTP below to verify your email address:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for <strong>5 minutes</strong>.</p>
          <p>If you didn’t request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} D-PAY ENTERPRISE. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};


export const loginMessage = (name, date) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login Alert - D-PAY ENTERPRISE</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
      <style>
        body {
          background-color: #f4f4f8;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 30px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .logo {
          text-align: center;
          margin-bottom: 25px;
        }
        .logo img {
          height: 50px;
        }
        .header {
          text-align: center;
          color: #1d3262;
          margin-bottom: 20px;
        }
        .header h2 {
          font-size: 22px;
          color: #1d3262;
        }
        .content {
          font-size: 15px;
          color: #333;
          line-height: 1.6;
        }
        .alert-box {
          background-color: #fff8e5;
          color: #7c5700;
          border-left: 4px solid #ffc107;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="logo">
          <img src="https://your-logo-url.com/logo.png" alt="Swift_Pay Logo" />
        </div>
        <div class="header">
          <h2>Login Notification</h2>
        </div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>We noticed a new login to your <strong>D-PAY ENTERPRISE</strong> account on:</p>
          <div class="alert-box">
            ${date}
          </div>
          <p>If this was <strong>you</strong>, no further action is needed.</p>
          <p>If this <strong>wasn't you</strong>, please <a href="#" style="color: #1d3262; text-decoration: underline;">reset your password immediately</a> to protect your account.</p>
          <p>Thank you for using D-PAY ENTERPRISE. We're glad to have you with us!</p>
        </div>
        <div class="footer">
          <p>Best regards,<br /><br/> </p>
          <p>&copy; ${new Date().getFullYear()} D-PAY ENTERPRISE. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};


export const confirmRegistrationMessage = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>D-PAY ENTERPRISE - Confirm Registration</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <style>
        body {
          background-color: #f4f4f8;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 30px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .logo {
          text-align: center;
          margin-bottom: 25px;
        }
        .logo img {
          height: 50px;
        }
        .header {
          text-align: center;
          color: #1d3262;
        }
        .otp-box {
          margin: 30px auto;
          background-color: #e9f0fc;
          border: 1px dashed #1d3262;
          color: #1d3262;
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          padding: 16px;
          border-radius: 8px;
          letter-spacing: 2px;
          width: 200px;
        }
        .content {
          font-size: 15px;
          color: #333;
          margin-top: 20px;
          line-height: 1.6;
        }
        .content strong {
          color: #1d3262;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="logo">
          <img src="https://your-logo-url.com/logo.png" alt="D-PAY Logo" />
        </div>
        <div class="header">
          <h2>Confirm Your Registration</h2>
        </div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for choosing <strong>D-PAY ENTERPRISE</strong>.</p>
          <p>Please use the OTP below to complete your registration:</p>
          <div class="otp-box">${otp}</div>
          <p>This code is valid for <strong>5 minutes</strong>.</p>
          <p>If you did not initiate this registration, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Thank you for joining us!</p>
          <p>&copy; ${new Date().getFullYear()} D-PAY ENTERPRISE. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};



export const registerMessage = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to D-PAY ENTERPRISE</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <style>
        body {
          background-color: #f4f4f8;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 30px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .logo {
          text-align: center;
          margin-bottom: 25px;
        }
        .logo img {
          height: 50px;
        }
        .header {
          text-align: center;
          color: #1d3262;
        }
        .content {
          font-size: 15px;
          color: #333;
          line-height: 1.6;
          margin-top: 20px;
        }
        .content strong {
          color: #1d3262;
        }
        ul {
          margin: 15px 0 20px 20px;
        }
        li {
          margin-bottom: 8px;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #777;
          text-align: center;
        }
        .support {
          color: #1d3262;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="logo">
          <img src="https://your-logo-url.com/logo.png" alt="Swift_Pay Logo" />
        </div>
        <div class="header">
          <h2>Welcome to Swift_Pay, ${name}!</h2>
        </div>
        <div class="content">
          <p>We’re thrilled to have you on board.</p>
          <p>Your registration is now complete and you’re all set to explore the full power of Swift_Pay.</p>
          <p><strong>Here’s what you can expect:</strong></p>
          <ul>
            <li>Fast and secure transactions</li>
            <li>Exclusive features and promotions</li>
            <li>Personalized financial dashboard</li>
            <li>Seamless bank integrations</li>
            <li>Robust data security</li>
            <li>Multi-currency transactions</li>
            <li>24/7 customer support</li>
          </ul>
          <p>If you need help at any point, feel free to contact us at <a href="#" class="support">D-PAY_support.com</a></p>
          <p>Thanks again for joining the D-PAY ENTERPRISE community!</p>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p>The D-PAY ENTERPRISE Team</p>
          <p>&copy; ${new Date().getFullYear()} D-PAY. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};

export const confirmTransferMessage = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>D-PAY ENTERPRISE - Confirm Transfer</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <style>
        body {
          background-color: #f4f4f8;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 30px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .logo {
          text-align: center;
          margin-bottom: 25px;
        }
        .logo img {
          height: 50px;
        }
        .header {
          text-align: center;
          color: #1d3262;
        }
        .otp-box {
          margin: 30px auto;
          background-color: #fff3cd;
          border: 1px dashed #856404;
          color: #856404;
          font-size: 22px;
          font-weight: 600;
          text-align: center;
          padding: 16px;
          border-radius: 8px;
          letter-spacing: 2px;
          width: 200px;
        }
        .content {
          font-size: 15px;
          color: #333;
          margin-top: 20px;
          line-height: 1.6;
        }
        .content strong {
          color: #1d3262;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #777;
          text-align: center;
        }
        .support {
          color: #1d3262;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="logo">
          <img src="https://your-logo-url.com/logo.png" alt="Swift_Pay Logo" />
        </div>
        <div class="header">
          <h2>Transfer Verification OTP</h2>
        </div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>To complete your transfer, please use the OTP code below:</p>
          <div class="otp-box">${otp}</div>
          <p>This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
          <p>If you did not initiate this transfer, please contact our security team immediately.</p>
          <h4>Need Help?</h4>
          <p>Reach out to our support team anytime at <a href="https://D-PAY_support.com" class="support">D-PAY_support.com</a>.</p>
          <p>Thank you for choosing Swift_Pay!</p>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p>The Swift_Pay Team</p>
          <p>&copy; ${new Date().getFullYear()} Swift_Pay. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};


export const validateAccountMessage = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>D-PAY ENTERPRISE - Validate Account</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <style>
        body {
          background-color: #f4f4f8;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 30px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .logo {
          text-align: center;
          margin-bottom: 25px;
        }
        .logo img {
          height: 50px;
        }
        .header {
          text-align: center;
          color: #1d3262;
        }
        .otp-box {
          margin: 30px auto;
          background-color: #e9f0fc;
          border: 1px dashed #1d3262;
          color: #1d3262;
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          padding: 16px;
          border-radius: 8px;
          letter-spacing: 2px;
          width: 200px;
        }
        .content {
          font-size: 15px;
          color: #333;
          margin-top: 20px;
          line-height: 1.6;
        }
        .content strong {
          color: #1d3262;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="logo">
          <img src="https://your-logo-url.com/logo.png" alt="D-PAY Logo" />

        </div>
        <div class="header">
          <h2>Validate Your Account</h2>
        </div>                                                                          

        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>To complete your account validation, please use the OTP code below:</p>
          <div class="otp-box">${otp}</div>
          <p>This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>

          <h4>Need Help?</h4>
          <p>Reach out to our support team anytime at <a href="https://D-PAY_support.com" class="support">D-PAY_support.com</a>.</p>
          <p>Thank you for choosing D-PAY ENTERPRISE!</p>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p>&copy; ${new Date().getFullYear()} D-PAY ENTERPRISE. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
}


export const withdrawalConfirmationMessage = (name,otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>D-PAY ENTERPRISE - Withdrawal Confirmation</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <style>
        body {
          background-color: #f4f4f8;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 30px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .logo {
          text-align: center;
          margin-bottom: 25px;
        }
        .logo img {
          height: 50px;
        }
        .header {
          text-align: center;
          color: #1d3262;
        }
        .content {
          font-size: 15px;
          color: #333;
          line-height: 1.6;
        }
        .content strong {
          color: #1d3262;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="logo">
          <img src="https://your-logo-url.com/logo.png" alt="D-PAY Logo" />
        </div>
        <div class="header">
          <h2>Withdrawal Confirmation</h2>
        </div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>To complete your withdrawal, please use the OTP code below:</p>
          <div class="otp-box">${otp}</div>
          <p>If you have any questions or concerns, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date}().getFullYear()} D-PAY ENTERPRISE. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
}