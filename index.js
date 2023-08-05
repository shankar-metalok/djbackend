const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const otpDatabase = {};

// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587, 
//   secure: false, 
//   auth: {
//     user: 'kellen.senger27@ethereal.email',
//     pass: 'YDPHnYeujVVRtrzrC5'
//   }
// });


const transporter = nodemailer.createTransport({ 
  service: 'gmail',
  port: 587, 
  secure: false, 
  auth: {
    user: 'shankar.narsim4@gmail.com',
    pass: 'rsdhhpegajoaodck',
   
  },
});



app.post('/api/generate-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); 

  otpDatabase[email] = otp;

  console.log('Generated OTP:', otp);



const mailOptions = {
    from: 'dj app',
    to: email, 
    subject: 'OTP Verification', 
    text: `Your OTP is: ${otp}`,
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: 'Error sending OTP. Please try again later.' });
    } else {
      console.log('Email sent successfully:', info.response);
      res.json({ message: `OTP sent to ${email}. Please check your email.` });
    }
  });

});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const savedOTP = otpDatabase[email];

  console.log('Received OTP:', otp);

  if (!savedOTP) {
    res.status(404).json({ message: 'OTP not found. Please generate OTP first.' });
  } else if (otp == savedOTP) {
    res.json({ message: 'OTP verified successfully.' });
  } else {
    res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
