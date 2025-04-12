const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware');
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicketStatus,
  addComment,
  getComments,
  deleteTicket,
  getTicketStats
} = require('../controllers/ticketController');

// All routes are protected by authentication
router.use(authenticateUser);

// Ticket routes
router.post('/', createTicket);                    // Create a new ticket
router.get('/', getTickets);                       // Get all tickets
router.get('/stats', getTicketStats);              // Get ticket statistics
router.get('/:id', getTicket);                     // Get a single ticket
router.put('/:id/status', updateTicketStatus);     // Update ticket status
router.delete('/:id', deleteTicket);               // Delete a ticket

// Comment routes
router.post('/:id/comments', addComment);          // Add a comment
router.get('/:id/comments', getComments);          // Get all comments for a ticket

module.exports = router; 