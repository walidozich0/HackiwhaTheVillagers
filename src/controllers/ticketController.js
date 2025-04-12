const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ticketService = require('../services/ticketService');
const { sendTicketUpdateNotification, sendAdminNotification } = require('../utils/emailService');

// Helper function to parse and validate ID
const parseId = (id) => {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error('Invalid ID');
  }
  return parsedId;
};

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const ticket = await ticketService.createTicket(req.body, req.user.id);

    // Send notification to ticket creator
    await sendTicketUpdateNotification(ticket, ticket.user, 'creation');

    // Send notification to admins
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { email: true }
    });
    
    if (admins.length > 0) {
      await sendAdminNotification(ticket, admins.map(admin => admin.email));
    }

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tickets (with filtering for non-admin users)
const getTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getTickets(req.query, req.user.id, req.user.role);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single ticket
const getTicket = async (req, res) => {
  try {
    const ticketId = parseId(req.params.id);
    const ticket = await ticketService.getTicket(ticketId, req.user.id, req.user.role);
    res.json(ticket);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const ticketId = parseId(req.params.id);
    const updatedTicket = await ticketService.updateTicketStatus(
      ticketId,
      req.body.status,
      req.user.id,
      req.user.role
    );

    // Send notification to ticket creator about status update
    await sendTicketUpdateNotification(updatedTicket, updatedTicket.user, 'status');

    res.json(updatedTicket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a ticket
const deleteTicket = async (req, res) => {
  try {
    const ticketId = parseId(req.params.id);
    await ticketService.deleteTicket(ticketId, req.user.id, req.user.role);
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add comment to ticket
const addComment = async (req, res) => {
  try {
    const ticketId = parseId(req.params.id);
    const comment = await ticketService.addComment(
      ticketId,
      req.body.content,
      req.user.id,
      req.user.role
    );

    // Send notification to ticket creator about new comment
    const ticket = await ticketService.getTicket(ticketId, req.user.id, req.user.role);
    await sendTicketUpdateNotification(ticket, ticket.user, 'comment');

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get ticket comments
const getComments = async (req, res) => {
  try {
    const ticketId = parseId(req.params.id);
    const comments = await ticketService.getComments(
      ticketId,
      req.user.id,
      req.user.role
    );
    res.json(comments);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Get ticket statistics
const getTicketStats = async (req, res) => {
  try {
    const stats = await ticketService.getTicketStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  updateTicketStatus,
  deleteTicket,
  addComment,
  getComments,
  getTicketStats
}; 