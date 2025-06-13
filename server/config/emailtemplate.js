export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Password Reset OTP</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05); text-align: center;">
    <h2 style="color: #4A90E2;">Hello {{userName}},</h2>
    <p>You requested to reset your password for your Brainbin account.</p>
    <p><strong>Your One-Time Password (OTP) is:</strong></p>
    <p style="font-size: 32px; font-weight: bold; color: #ffffff; background-color: #4A90E2; padding: 15px 30px; display: inline-block; letter-spacing: 6px; border-radius: 8px; margin: 20px 0;">
      {{otp}}
    </p>
    <p style="margin-top: 30px;">This OTP is valid for <strong>15 minutes</strong>. Please use it as soon as possible to complete the password reset process.</p>
    <p>If you didn’t request this, you can safely ignore this email — your password will remain unchanged.</p>
    <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
    <p style="font-size: 12px; color: #888;">© 2025 <strong>Brainbin Inc.</strong> All rights reserved.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Brainbin</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      padding: 30px;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #fff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    }
    h2 {
      color: #4CAF50;
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      margin: 10px 0;
    }
    .cta-button {
      display: inline-block;
      margin-top: 25px;
      padding: 12px 25px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #45a049;
    }
    .footer {
      margin-top: 40px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to Brainbin, {{userName}}! 🎉</h2>
    <p>We're thrilled to have you here.</p>
    <p>Brainbin helps you store, sort, and simplify your digital life effortlessly.</p>



    <p style="margin-top: 30px;">If you have any questions, just reply to this email — we’d love to help you out!</p>

    <div class="footer">
      © 2025 <strong>Brainbin Inc.</strong> All rights reserved.<br/>
      You’re receiving this email because you signed up for Brainbin.
    </div>
  </div>
</body>
</html>
`
