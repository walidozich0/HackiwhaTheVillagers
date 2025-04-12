const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

class UserService {
  // Create a new user
  async createUser(userData) {
    const { name, email, password, role } = userData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'user'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return user;
  }

  // Get all users
  async getUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    return users;
  }

  // Get user by ID
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Update user
  async updateUser(id, userData) {
    const { name, email, role } = userData;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return user;
  }

  // Delete user
  async deleteUser(id) {
    // Check if user has any tickets
    const userTickets = await prisma.ticket.findMany({
      where: { userId: id }
    });

    if (userTickets.length > 0) {
      throw new Error('Cannot delete user with active tickets');
    }

    await prisma.user.delete({
      where: { id }
    });

    return { message: 'User deleted successfully' };
  }

  // Get user statistics
  async getUserStatistics() {
    const stats = await prisma.user.aggregate({
      _count: true,
      _count: {
        role: true
      }
    });

    const ticketsByUser = await prisma.ticket.groupBy({
      by: ['userId'],
      _count: {
        id: true
      }
    });

    return {
      totalUsers: stats._count,
      ticketsByUser
    };
  }
}

module.exports = new UserService(); 