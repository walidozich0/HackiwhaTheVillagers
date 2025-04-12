const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TicketService {
  // Create a new ticket
  async createTicket(ticketData, userId) {
    const { title, description, category, priority } = ticketData;

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        category,
        priority,
        userId,
        status: 'open'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return ticket;
  }

  // Get all tickets with filters
  async getTickets(filters, userId, userRole) {
    const where = {};
    
    // Non-admin users can only see their own tickets
    if (userRole !== 'admin') {
      where.userId = userId;
    }

    // Add filters if provided
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.priority) where.priority = filters.priority;

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return tickets;
  }

  // Get a single ticket
  async getTicket(id, userId, userRole) {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Check if user has permission to view this ticket
    if (userRole !== 'admin' && ticket.userId !== userId) {
      throw new Error('Not authorized to view this ticket');
    }

    return ticket;
  }

  // Update ticket status
  async updateTicketStatus(id, status, userId, userRole) {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Check if user has permission to update this ticket
    if (userRole !== 'admin' && ticket.userId !== userId) {
      throw new Error('Not authorized to update this ticket');
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status },
      include: {
        user: true
      }
    });

    return updatedTicket;
  }

  // Add comment to ticket
  async addComment(ticketId, content, userId, userRole) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: true
      }
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Check if user has permission to comment on this ticket
    if (userRole !== 'admin' && ticket.userId !== userId) {
      throw new Error('Not authorized to comment on this ticket');
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        ticketId,
        userId
      }
    });

    return comment;
  }

  // Get ticket comments
  async getComments(ticketId, userId, userRole) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Check if user has permission to view this ticket's comments
    if (userRole !== 'admin' && ticket.userId !== userId) {
      throw new Error('Not authorized to view comments');
    }

    const comments = await prisma.comment.findMany({
      where: { ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return comments;
  }

  // Get ticket statistics
  async getTicketStatistics() {
    try {
      // Get total count
      const totalCount = await prisma.ticket.count();

      // Get count by status
      const byStatus = await prisma.ticket.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });

      // Get count by category
      const byCategory = await prisma.ticket.groupBy({
        by: ['category'],
        _count: {
          id: true
        }
      });

      // Get count by priority
      const byPriority = await prisma.ticket.groupBy({
        by: ['priority'],
        _count: {
          id: true
        }
      });

      // Format the results
      const formattedStats = {
        totalTickets: totalCount,
        byStatus: {},
        byCategory: {},
        byPriority: {}
      };

      // Format status counts
      byStatus.forEach(stat => {
        formattedStats.byStatus[stat.status] = stat._count.id;
      });

      // Format category counts
      byCategory.forEach(stat => {
        formattedStats.byCategory[stat.category] = stat._count.id;
      });

      // Format priority counts
      byPriority.forEach(stat => {
        formattedStats.byPriority[stat.priority] = stat._count.id;
      });

      return formattedStats;
    } catch (error) {
      console.error('Error getting ticket statistics:', error);
      throw new Error('Failed to get ticket statistics');
    }
  }

  // Delete a ticket
  async deleteTicket(id, userId, userRole) {
    const ticket = await prisma.ticket.findUnique({
      where: { id }
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Check if user has permission to delete this ticket
    if (userRole !== 'admin' && ticket.userId !== userId) {
      throw new Error('Not authorized to delete this ticket');
    }

    // Delete the ticket
    await prisma.ticket.delete({
      where: { id }
    });
  }
}

module.exports = new TicketService(); 