const nodemailer = require('nodemailer');

const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST } = process.env;

module.exports = {
  sendMailActivation: async (receiverEmail, codeActivation) => {
    try {
      let transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
      });

      let info = await transporter.sendMail({
        from: EMAIL_USER,
        to: receiverEmail,
        subject: "Activation Farmer Account",
        html: `
        <html>
        <head>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" rel="stylesheet" type="text/css">
        </head>
        <body style="margin: 0; font-family: 'Open Sans'">
          <img style="object-fit: cover;" width="100%" height="200" src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGFkZHl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" alt="welcome to farmer nusantara">
          <div style="padding: 40px;">
            <h1>Selamat datang Farmer!</h1>
            <p>Terimakasih sudah mempercayai <strong>Farmer Nusantara</strong> sebagai partner dalam membangun pertanian kamu.</p>
            <p>Satu tahap lagi untuk verfikasi akun kamu.</p><br/>
            <p>Berikut token code untuk aktifasi akun kamu. (kadaluarsa dalam 10 menit)</p>
            <code style="font-size: 19px; font-weight: bold; background-color: #BAD3FC; padding: 10px 20px">${codeActivation}</code>
            <p style="color: red;">*note: jangan share token code ini kepada siapapun!</p>
            </div>
            </div>
            <div style="width: 100%; padding: 20px 0; background-color: #9CA3AF; display: flex; justify-content: center;">Farmer Nusantara</div>
          </body>
        </html>
        `,
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error(error)
    }
  },
  sendMailCodeResetPassword: async (receiverEmail, codeResetPassword) => {
    try {
      let transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
      });

      let info = await transporter.sendMail({
        from: EMAIL_USER,
        to: receiverEmail,
        subject: "Token Code for reset password account",
        html: `
        <html>
        <head>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" rel="stylesheet" type="text/css">
        </head>
        <body style="margin: 0; font-family: 'Open Sans'">
          <img style="object-fit: cover; background-potition: cover; width: 100%; height: 200px;" src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGFkZHl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" alt="welcome to farmer nusantara">
          <div style="padding: 40px;">
            <h1>Reset Token</h1>
            <p>Berikut token code untuk reset password akun kamu. (kadaluarsa dalam 10 menit)</p>
            <code style="font-size: 19px; font-weight: bold; background-color: #BAD3FC; padding: 10px 20px">${codeResetPassword}</code>
            <p style="color: red;">*note: jangan share token code ini kepada siapapun!</p>
            </div>
            <div style="width: 100%; padding: 20px 0; background-color: #9CA3AF; display: flex; justify-content: center;">Farmer Nusantara</div>
          </body>
        </html>
        `,
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error(error);
    }
  },
}