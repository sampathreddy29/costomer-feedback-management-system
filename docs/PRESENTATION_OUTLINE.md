# Presentation Outline: Customer Feedback Management System

Target duration: 10-15 minutes.

## Slide 1: Title

- Customer Feedback Management System
- B9IS130 Web Development for Information Systems
- Student name and date

## Slide 2: Problem Statement

- Businesses often collect feedback through paper forms, email, and social media.
- Feedback becomes fragmented and difficult to analyse.
- The system centralises feedback collection, response, analytics, and reporting.

## Slide 3: Users and Stakeholders

- Customers: submit feedback, ratings, screenshots, and view replies.
- Admins: manage feedback, users, responses, and reports.
- Business decision makers: use analytics to improve services.

## Slide 4: Technology Stack

- MongoDB Atlas
- Express.js
- React/Vite
- Node.js
- JWT, bcrypt, Mongoose, Multer, Helmet, express-validator

## Slide 5: System Architecture

- React frontend sends HTTP requests.
- Express API validates and authorizes requests.
- Mongoose models persist data in MongoDB Atlas.
- Role-based views separate customer and admin workflows.

## Slide 6: Customer Demonstration

Demo:

1. Register customer.
2. Login.
3. Submit feedback with rating/category/comment.
4. Upload screenshot if needed.
5. View feedback history.

## Slide 7: Admin Demonstration

Demo:

1. Login as admin.
2. View analytics dashboard.
3. Search/filter feedback.
4. Reply to feedback.
5. Update status.
6. Export CSV.
7. Manage users.

## Slide 8: Database Design

- Users collection stores accounts, roles, and hashed passwords.
- Feedback collection stores ratings, categories, comments, status, sentiment, screenshots, and admin replies.
- Indexes support search and filtering.

## Slide 9: Security

- bcrypt password hashing
- JWT authentication
- Role-based authorization
- Input validation
- Helmet security headers
- CORS configuration
- Rate limiting
- NoSQL injection sanitisation
- Image upload restrictions

## Slide 10: Deployment

- MongoDB Atlas for database.
- Render for backend API.
- Vercel for frontend.
- Environment variables separate secrets from code.

## Slide 11: Testing and Verification

- Frontend production build passed.
- Backend syntax checks passed.
- npm audit reported zero high vulnerabilities.
- MongoDB Atlas connection confirmed.
- Registration endpoint tested successfully.

## Slide 12: Reflection and Future Work

- Challenges: Atlas connection, CORS, role-based workflows.
- Future work: automated tests, email notifications, PDF reports, advanced sentiment analysis, audit logs.

## Slide 13: Conclusion

- Full-stack MERN application.
- Meets assessment requirements for frontend, backend, database, APIs, security, software engineering, and deployment readiness.

## Possible Questions and Answers

**Why MERN?**
It uses JavaScript across the full stack, supports rapid development, and is strongly aligned with the assessment brief.

**How are passwords protected?**
Passwords are hashed using bcrypt before storage and are not returned by API responses.

**How is authorization handled?**
JWT verifies identity, and role middleware restricts admin-only routes.

**How does the dashboard work?**
The backend uses MongoDB aggregation to calculate feedback totals, average ratings, sentiment counts, and monthly trends.

**What would you improve next?**
Automated tests, email notifications, PDF export, audit logging, and AI-based sentiment analysis.