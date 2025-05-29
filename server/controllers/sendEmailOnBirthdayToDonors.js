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
    const donors = await User.find({ role: "Donor" }).lean();

    const today = new Date();
    const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (const donor of donors) {
      const donorBirthday = donor.birthDate?.slice(5); // MM-DD
      if (donorBirthday === mmdd && donor.email) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: donor.email,
            subject: 'Happy Birthday!',
            text: `Hello ${donor.name}, happy birthday!`
          });
          console.log(`Sent birthday email to ${donor.name} (${donor.email})`);
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