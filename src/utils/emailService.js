const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Function to send ticket update notification
const sendTicketUpdateNotification = async (ticket, user, updateType) => {
  try {
    let subject = '';
    let message = '';

    switch (updateType) {
      case 'status':
        subject = `Ticket #${ticket.id} Status Update`;
        message = `
          <h2>Ticket Status Update</h2>
          <p>Your ticket "${ticket.title}" has been updated.</p>
          <p><strong>New Status:</strong> ${ticket.status}</p>
          <p>You can view the ticket details by clicking <a href="${process.env.FRONTEND_URL}/tickets/${ticket.id}">here</a>.</p>
        `;
        break;
      case 'comment':
        subject = `New Comment on Ticket #${ticket.id}`;
        message = `
          <h2>New Comment on Your Ticket</h2>
          <p>A new comment has been added to your ticket "${ticket.title}".</p>
          <p>You can view the comment by clicking <a href="${process.env.FRONTEND_URL}/tickets/${ticket.id}">here</a>.</p>
        `;
        break;
      case 'creation':
        subject = `New Ticket Created #${ticket.id}`;
        message = `
          <h2>Ticket Created Successfully</h2>
          <p>Your ticket "${ticket.title}" has been created.</p>
          <p>You can track its progress by clicking <a href="${process.env.FRONTEND_URL}/tickets/${ticket.id}">here</a>.</p>
        `;
        break;
      default:
        return;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: subject,
      html: message
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

// Function to send admin notification for new ticket
const sendAdminNotification = async (ticket, adminEmails) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: adminEmails.join(', '),
      subject: `New Ticket Created #${ticket.id}`,
      html: `
        <h2>New Ticket Created</h2>
        <p>A new ticket has been created and requires attention.</p>
        <p><strong>Ticket Details:</strong></p>
        <ul>
          <li>Title: ${ticket.title}</li>
          <li>Category: ${ticket.category}</li>
          <li>Priority: ${ticket.priority}</li>
        </ul>
        <p>You can view the ticket by clicking <a href="${process.env.FRONTEND_URL}/admin/tickets/${ticket.id}">here</a>.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Admin notification sent');
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};

module.exports = {
  sendTicketUpdateNotification,
  sendAdminNotification
}; 