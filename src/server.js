<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
=======
const {client}=require('pg')



const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
>>>>>>> 7e0c1194013b0bccb7881c71a6173c88939577bf

// Hardcoded database URL for testing
process.env.DATABASE_URL = "postgresql://postgres:walidozich@localhost:5432/hackiwha_tickets";

const prisma = new PrismaClient();
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const { authenticateUser, isAdmin } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
<<<<<<< HEAD

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', authenticateUser, ticketRoutes);
app.use('/api/admin', authenticateUser, isAdmin, adminRoutes);
app.use('/api/users', authenticateUser, userRoutes);

// Health check route
=======
app.use("/api/auth", authRoutes);
const db = new client({ 
  user: 'postgres',
  host: 'localhost',
  port :5432,
  database: 'hackiwha_tickets',
  password: ' walidozich',
})
db.connect().then((  )=> console.log   ("connceted")  )
>>>>>>> 7e0c1194013b0bccb7881c71a6173c88939577bf
app.get("/", (req, res) => {
  res.send("Hackiwha API is running ✅");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server ready on http://localhost:${PORT}`));
<<<<<<< HEAD
// Test database connection
async function main() {
  try {
    const allUsers = await prisma.user.findMany();
    console.log(allUsers);
    //test the JWT_SECRET
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

main();
=======

>>>>>>> 7e0c1194013b0bccb7881c71a6173c88939577bf
