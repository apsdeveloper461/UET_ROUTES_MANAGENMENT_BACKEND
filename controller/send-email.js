const nodemailer = require('nodemailer');

/**
 * Sends an email with an embedded link.
 *
 * @param {string} recipient - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} link - The link to embed in the email.
 */
async function sendEmailWithLink(recipient, subject, link) {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider
      auth: {
        user: 'mehboobalam786461@gmail.com', // Your email
        pass: 'pffl sbgi uyvj loyw', // App password
      },
    });

    // Define the email options
    const mailOptions = {
      from: '"UET Routes Management System" <mehboobalam786461@gmail.com>', // Sender
      to: recipient, // Receiver
      subject: subject, // Subject
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Hello!</h2>
          <p>Click the link below to complete your verification:</p>
          <a href="${link}" style="color: #007BFF; text-decoration: none;">
            ${link}
          </a>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `, // Email content with embedded link
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    // console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendEmailWithLink;
