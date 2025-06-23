Authentication System - Full Stack (Node.js + React)
Overview
A secure authentication system featuring:

User registration & login

Password reset via OTP

Session management

Protected routes

Tech Stack
Frontend (React)
React 18+

React Router v6

Axios for HTTP requests

React Toastify for notifications

Context API for state management

Backend (Node.js)
Express.js server

MongoDB with Mongoose

JWT for authentication

Bcrypt for password hashing

Nodemailer for OTP emails

CORS middleware

Cookie-parser for session management

Features
User Authentication
Email/password registration

Secure login with JWT

Protected routes

Session persistence

Password Management
Secure password hashing

OTP-based password reset

Email verification

Password strength enforcement

Security
CSRF protection

Rate limiting

Secure HTTP headers

Input sanitization

Project Structure
text
auth-system/
├── client/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/       # Static files
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Global state
│   │   ├── pages/        # Route components
│   │   ├── services/     # API services
│   │   └── App.js        # Main component
│   └── package.json
│
├── server/               # Node.js backend
│   ├── config/           # DB config
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Auth middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Helpers (email, tokens)
│   ├── app.js            # Express app
│   └── package.json
│
└── README.md
