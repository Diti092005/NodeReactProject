const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendBirthdayEmails = async () => {
  try {
    const donors = await User.find({ role: "Donor",active:true }).lean();

    const today = new Date();

    for (const donor of donors) {
      const donorBirthday = donor.birthDate 
      if (donorBirthday&&donorBirthday.getMonth() === donorBirthday.getMonth()&& donorBirthday.getDay() === donorBirthday.getDay()&& donor.email) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: donor.email,
            subject: 'Happy Birthday!',
            text: `Hello ${donor.fullname}, happy birthday,
            thank you for all your contributions`
          });
          console.log(`Sent birthday email to donor: ${donor.fullname} (${donor.email})`);
        } catch (err) {
          console.error(`Error sending to ${donor.email}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('Error fetching donors:', err);
  }
};

module.exports = { sendBirthdayEmails };