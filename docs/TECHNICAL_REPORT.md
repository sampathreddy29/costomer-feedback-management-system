# Technical Report: Customer Feedback Management System

## 1. Introduction

The Customer Feedback Management System is a full-stack web application designed to help businesses collect, manage, analyse, and respond to customer feedback in a structured digital environment. Many small and medium-sized businesses still collect feedback through paper forms, emails, social media messages, or informal conversations. These methods create fragmented records and make it difficult to identify customer satisfaction trends, respond to complaints, or use feedback as evidence for service improvement. The proposed system addresses this information systems problem by providing a centralised platform where customers can submit feedback and administrators can manage, filter, analyse, and report on that information.

The project was developed as a MERN stack application using MongoDB Atlas, Express.js, React, and Node.js. This stack was selected because it provides a consistent JavaScript-based development environment across the front-end and back-end. It also supports modular design, RESTful API communication, scalable cloud deployment, and flexible document-based data storage. The application includes customer registration and login, feedback submission with ratings and screenshots, customer feedback tracking, administrator feedback management, user management, analytics, and CSV report export.

The overall aim of the project is to demonstrate a complete web-based information system that meets the requirements of the B9IS130 Web Development for Information Systems assessment. The system demonstrates requirements analysis, front-end development, back-end architecture, database integration, API communication, security implementation, software engineering practice, and cloud deployment readiness.

## 2. Problem Domain and Requirements Analysis

The problem domain is customer satisfaction management. Feedback is valuable because it allows businesses to identify service issues, product weaknesses, and recurring customer needs. However, when feedback is collected through disconnected channels, it becomes difficult to organise and analyse. Paper-based feedback can be lost, email feedback is hard to aggregate, and social media feedback may not be linked to formal business processes. The system therefore focuses on creating a structured feedback workflow.

The primary stakeholders are customers, administrators, and business decision makers. Customers need a simple way to submit feedback, rate their experience, provide evidence such as screenshots, and track responses. Administrators need a secure dashboard to view all feedback, search and filter records, reply to customers, update statuses, delete inappropriate records, manage users, and produce reports. Business decision makers need summarised information such as average ratings, positive and negative feedback counts, category breakdowns, and monthly trends.

The functional requirements are as follows. Customers must be able to register, log in, submit feedback, give ratings between one and five stars, upload screenshots, and view previous submissions. Administrators must be able to log in securely, view all feedback, filter and search feedback, reply to feedback, update feedback status, delete feedback, manage users, view analytics, and export reports. The system must also support role-based access control so that customers and administrators can only access appropriate functionality.

The non-functional requirements include security, usability, maintainability, responsiveness, reliability, and deployability. Passwords must be hashed, authenticated sessions must use secure tokens, user input must be validated, and common injection risks must be reduced. The interface must be readable and responsive on different screen sizes. The codebase must be modular, documented, and organised into clear responsibilities. The application must be suitable for deployment using cloud platforms such as MongoDB Atlas, Render, and Vercel.

## 3. System Architecture

The application follows a client-server architecture. The front-end React application runs in the browser and communicates with the back-end Express API using HTTP requests. Data is exchanged primarily in JSON format, while screenshot uploads use multipart form data. The back-end validates requests, applies authentication and authorization rules, interacts with MongoDB through Mongoose models, and returns structured responses to the client.

The back-end is separated into routes, controllers, models, middleware, configuration, and utilities. Routes define the API endpoints, controllers contain request-handling logic, models define database schemas, middleware handles authentication, validation, uploads, and errors, and configuration manages the database connection. This separation of concerns improves maintainability and makes the system easier to test and extend.

The front-end is organised around a main React application component and a small API utility module. The user interface changes according to authentication state and user role. Customers see feedback submission and history views, while administrators see dashboard, feedback management, and user management views. The design avoids unnecessary landing-page content and focuses directly on the application workflows.

MongoDB Atlas is used as the cloud database. The document model is appropriate because feedback records can contain nested reply data, optional screenshot fields, status information, and derived sentiment values. Mongoose provides schema validation, relationships through ObjectId references, query helpers, indexing, and model methods.

## 4. Front-End Development and User Experience

The front-end was built using React and Vite. React was chosen because it supports component-based development, dynamic state management, and efficient rendering for interactive user interfaces. Vite was used because it provides a fast development server and a simple production build process.

The user interface is divided into authentication, customer, and administrator workflows. The authentication screen provides registration and login in a single clear interface. After login, role-based navigation determines the available sections. Customers can submit feedback using a form with rating, category, comment, and optional screenshot upload. They can also view their feedback history and administrator replies. Administrators can view analytics, manage all feedback, update statuses, reply to customers, export reports, and manage user accounts.

The interface uses responsive CSS so that the layout adapts to smaller screens. On desktop, the application uses a sidebar and content area. On smaller screens, layouts collapse into single-column sections to preserve readability. Buttons use icon and text combinations for common actions such as submit, refresh, logout, export, reply, and delete. Form controls use consistent spacing, labels, and validation attributes to improve usability.

Accessibility considerations include semantic form labels, readable colour contrast, clear navigation labels, visible states, and responsive text sizing. The design uses a restrained professional visual style suited to an operational information system rather than a marketing website. This matches the purpose of the application, where repeated use, scanning, filtering, and task completion are more important than decorative presentation.

## 5. Back-End Development and Database Integration

The back-end was built using Node.js and Express.js. Express provides a lightweight routing and middleware system that is suitable for RESTful APIs. The API includes authentication routes, feedback routes, user management routes, and reporting routes.

The `User` model stores name, email, password, role, account status, and timestamps. Passwords are hashed before saving using bcrypt. The model also includes a method for comparing login passwords with stored hashes. The `Feedback` model stores the customer reference, rating, category, comment, screenshot path, status, sentiment, reply data, and timestamps. Sentiment is derived automatically from the rating: high ratings are positive, low ratings are negative, and middle ratings are neutral.

The system implements CRUD operations for feedback. Customers can create feedback, view their own feedback, view a specific feedback item, update unresolved feedback, and delete their own feedback. Administrators can view all feedback, search and filter records, update statuses, reply to feedback, and delete records. User management allows administrators to list users, change roles, activate or deactivate accounts, and delete users.

Database integration is handled through Mongoose. Mongoose schemas provide data structure, validation, references, and indexes. Feedback indexes support efficient queries by user, rating, status, category, and text search. The application uses MongoDB Atlas for cloud-hosted persistence, which supports deployment beyond the local development environment.

## 6. API and Web Service Integration

The project demonstrates API integration through RESTful communication between the React front-end and Express back-end. The front-end uses a central API utility that attaches JSON headers and JWT authorization tokens automatically. This abstraction reduces duplication and makes the client-server communication easier to maintain.

The API uses JSON for authentication, user management, analytics, and standard feedback operations. Screenshot uploads use multipart form data through Multer. The reporting endpoint returns CSV data for export. The dashboard endpoints use aggregation queries to return summary metrics and monthly trends.

The main endpoints include `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/feedback`, `GET /api/feedback`, `GET /api/feedback/mine`, `PUT /api/feedback/:id`, `DELETE /api/feedback/:id`, `GET /api/users`, `PATCH /api/users/:id`, `GET /api/reports/summary`, `GET /api/reports/monthly-trends`, and `GET /api/reports/export.csv`.

This architecture demonstrates client-server data exchange, asynchronous requests, token-protected routes, JSON payloads, file upload handling, and role-restricted service access.

## 7. Security Implementation

Security was treated as a core requirement. Passwords are not stored in plain text. The system uses bcrypt hashing with a salt factor before storing user passwords in MongoDB. Authentication is handled using JSON Web Tokens, which are issued after successful registration or login. Protected routes require a bearer token in the Authorization header.

Authorization is role-based. Customers can only access their own feedback except for general create actions. Administrators can access all feedback, reports, and user management functionality. The middleware checks the authenticated user and role before allowing restricted operations.

Input validation is implemented using express-validator and Mongoose schema rules. Registration requires a valid name, email, and password. Feedback requires a valid rating, category, and comment length. MongoDB query sanitisation is applied using express-mongo-sanitize to reduce NoSQL injection risk. Helmet is used to set safer HTTP headers. CORS is configured to allow approved front-end origins. Rate limiting reduces automated abuse. Multer limits uploaded image size and restricts accepted file types to images.

The application also uses environment variables for secrets such as MongoDB URI and JWT secret. These values should not be pushed to GitHub. `.gitignore` files are included to prevent accidental submission of `.env`, dependencies, logs, build output, and uploaded runtime files.

## 8. Software Engineering Practice

The project uses modular code organisation to support maintainability. The back-end is divided into folders for configuration, controllers, middleware, models, routes, scripts, uploads, and utilities. This makes the code easier to understand and reduces coupling between concerns. For example, authentication logic is isolated in middleware, validation is handled separately, and database schemas are defined in model files.

The front-end uses a central API module to avoid repeating fetch logic across components. Session storage, token access, and request handling are abstracted into reusable functions. The UI is structured around role-based views, allowing customer and administrator functionality to share the same application shell while remaining logically separate.

Project documentation has been added to support repository quality. The README explains the project purpose, technology stack, local setup, environment variables, features, and assessment evidence. Additional documents describe deployment, API endpoints, database schema, requirements mapping, report content, and presentation structure.

Version control is supported through a local Git repository. Before final submission, sensitive files such as `.env` should be removed from tracking if they were previously committed. The final repository should contain source code, documentation, configuration templates, and setup instructions, but not secrets or dependency folders.

## 9. Testing and Verification

Several verification activities were carried out during development. The front-end production build was run using `npm run build` to confirm that React and Vite compile successfully. Backend JavaScript syntax checks were run against source files. Dependency audit checks were performed with npm audit and reported zero high-severity vulnerabilities at the time of testing. The MongoDB Atlas connection was tested and eventually confirmed through the server log showing a successful connection. Registration was tested through an HTTP request with the front-end origin header, confirming that CORS and the register endpoint returned status code 201.

Further testing should be included before final submission. This should include manual testing of registration, login, customer feedback creation, screenshot upload, feedback history, admin login, feedback reply, status update, user management, analytics, and CSV export. Screenshots of these tests can be included in the final report to strengthen the evidence base.

## 10. Cloud Deployment Strategy

The deployment strategy uses MongoDB Atlas for the database, Render for the Express API, and Vercel for the React front-end. This approach separates responsibilities and follows common MERN deployment practice. MongoDB Atlas manages the database as a cloud service. Render runs the back-end API as a Node web service. Vercel builds and serves the static React application.

Environment variables must be configured separately in each deployment platform. The back-end requires the production MongoDB URI, JWT secret, token expiry, client URL, and Node environment. The front-end requires the deployed API URL and upload base URL. After deployment, the Render API URL should be added to the Vercel environment variables, and the Vercel URL should be added to the backend `CLIENT_URL` variable.

The deployment guide in the repository explains the process step by step. The final Moodle submission must include both the GitHub repository URL and the deployed application URL.

## 11. Critical Reflection

The project demonstrates how a full-stack JavaScript application can solve a practical information systems problem. The MERN stack was effective because it allowed a consistent development language across the system. Express and Mongoose supported rapid development of structured API endpoints, while React supported a role-based interactive interface.

One challenge was configuring MongoDB Atlas connectivity. The connection process required correct network access settings, correct database user credentials, and the correct cluster URI. This highlighted the importance of environment configuration and careful separation between application code and cloud infrastructure settings. Another challenge was CORS configuration, because browsers treat `localhost` and `127.0.0.1` as different origins. This was resolved by allowing both development origins in the backend.

If the project were extended further, useful improvements would include automated unit and integration tests, email notifications for admin replies, PDF report generation, more advanced sentiment analysis, audit logging, and a more detailed user profile system. These features would increase the system's operational value and provide stronger evidence of advanced web development techniques.

## 12. Conclusion

The Customer Feedback Management System meets the core requirements of a modern full-stack web application. It includes a responsive React front-end, a modular Express back-end, MongoDB Atlas database integration, REST API communication, authentication, authorization, validation, file uploads, analytics, reporting, and deployment readiness. The system addresses a clear information systems problem and provides practical workflows for customers and administrators. With final deployment URLs, screenshots, and personal reflection added, the project is suitable for submission against the B9IS130 assessment brief.

## References

MongoDB, Inc. (2026) *MongoDB Atlas Documentation*. Available at: https://www.mongodb.com/docs/atlas/ (Accessed: 5 July 2026).

MongoDB, Inc. (2026) *Mongoose Documentation*. Available at: https://mongoosejs.com/docs/ (Accessed: 5 July 2026).

OpenJS Foundation (2026) *Node.js Documentation*. Available at: https://nodejs.org/docs/ (Accessed: 5 July 2026).

Express.js (2026) *Express Documentation*. Available at: https://expressjs.com/ (Accessed: 5 July 2026).

Meta Open Source (2026) *React Documentation*. Available at: https://react.dev/ (Accessed: 5 July 2026).

Vite (2026) *Vite Documentation*. Available at: https://vite.dev/ (Accessed: 5 July 2026).

OWASP Foundation (2021) *OWASP Top Ten Web Application Security Risks*. Available at: https://owasp.org/www-project-top-ten/ (Accessed: 5 July 2026).

Vercel (2026) *Vercel Documentation*. Available at: https://vercel.com/docs (Accessed: 5 July 2026).

Render (2026) *Render Documentation*. Available at: https://render.com/docs (Accessed: 5 July 2026).