# Hackiwha_The_Villagers

=====

INSTALLATION:

npm init -y
npm install express dotenv mongoose cors jsonwebtoken bcryptjs

=====

Project Structure :
This file structure follows a modular and scalable architecture to separate concerns and improve maintainability:

controllers/ – Handle HTTP request/response logic for each feature.

routes/ – Define and organize API endpoints, linked to controllers.

services/ – Contain the core business logic and interact with the database.

middlewares/ – Store custom Express middleware (e.g., authentication).

utils/ – Utility functions and reusable helpers (e.g., DB config, token generation).

prisma/ – Includes Prisma schema and migration files for database management.

server.js – Entry point of the application, sets up Express and middleware.

This structure ensures clear responsibility boundaries and makes the project easy to navigate and extend.

=====

tested Routes with POSTMAN :

POST http://localhost:5000/api/auth/register
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
}

POST http://localhost:5000/api/auth/login
{
    "email": "test@example.com",
    "password": "test123"
}

POST http://localhost:5000/api/tickets

{
    "title": "First Ticket",
    "description": "This is my first ticket",
    "category": "technical",
    "priority": "high"
}

GET http://localhost:5000/api/tickets/1
PUT http://localhost:5000/api/tickets/1/status

{
    "status": "in_progress"
}

DELETE http://localhost:5000/api/tickets/1
POST http://localhost:5000/api/tickets/1/comments

{
    "content": "This is a test comment"
}

GET http://localhost:5000/api/tickets/1/comments

GET http://localhost:5000/api/users/4

PUT http://localhost:5000/api/users/4

DELETE http://localhost:5000/api/users/4

GET http://localhost:5000/api/users

POST http://localhost:5000/api/admin/users

GET http://localhost:5000/api/admin/users

PUT http://localhost:5000/api/admin/users/2

DELETE http://localhost:5000/api/admin/users/2

GET http://localhost:5000/api/admin/stats

GET http://localhost:5000/api/admin/users/stats 

GET http://localhost:5000/api/tickets/stats