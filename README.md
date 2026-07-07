# Customer Feedback Management System

A MERN stack web application for collecting, managing, analysing, and reporting customer feedback. The project was developed for B9IS130 Web Development for Information Systems and demonstrates full-stack JavaScript development, database integration, authentication, authorization, validation, analytics, and cloud deployment readiness.

## Technology Stack

- Frontend: React, Vite, CSS, lucide-react icons
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT and bcrypt password hashing
- Security: Helmet, CORS, rate limiting, input validation, NoSQL sanitisation, role-based access control
- Deployment target: Vercel for frontend, Render for backend, MongoDB Atlas for database

## Main Features

### Customer

- Register and login
- Submit feedback with category, comment, 1-5 star rating, and optional screenshot
- View submitted feedback history
- View admin replies and status updates

### Admin

- Secure admin login
- View all feedback
- Search and filter by keyword, status, category, rating, sentiment, and date range
- Reply to feedback
- Update feedback status
- Delete feedback
- Manage users, roles, and account activity
- View analytics dashboard with total feedback, average rating, sentiment counts, status/category breakdown, and monthly trends
- Export feedback report as CSV

## Local Setup

### Backend

```bash
cd Backend
npm install
copy .env.example .env
npm run dev
```

Update `Backend/.env` with your own MongoDB Atlas URI and JWT secret.

### Frontend

```bash
cd Frontend
npm install
copy .env.example .env
npm run dev
```

Open `http://127.0.0.1:5173`.

## Important Environment Variables

Backend:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/customer_feedback_system?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://127.0.0.1:5173
NODE_ENV=development
DNS_SERVERS=1.1.1.1,8.8.8.8
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000
```

## Deployment

Full deployment instructions are in `docs/DEPLOYMENT.md`.

Recommended deployment:

- MongoDB Atlas: database
- Render: backend web service
- Vercel: frontend static deployment


## Live Deployment URLs

- Frontend: https://customer-feedback-management-system-black.vercel.app
- Backend API: https://costomer-feedback-management-system.onrender.com
- GitHub Repository: https://github.com/sampathreddy29/costomer-feedback-management-system
