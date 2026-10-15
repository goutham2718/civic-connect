# CivicConnect — Public Grievance & Civic Issue Tracker

> **Report. Upvote. Resolve.**
> A MERN-based platform for reporting, tracking, and managing civic issues in **Palakkad, Kerala**.

CivicConnect is a full-stack web application designed to connect citizens with relevant authorities in **Palakkad, Kerala** through a centralized platform for reporting and tracking civic issues such as potholes, streetlights, garbage, water-related problems, sanitation issues, drainage problems, and other local infrastructure concerns.

The project is currently **in development** and focuses specifically on civic issue reporting and management within **Palakkad district**.

---

## Problem Statement

Citizens in Palakkad may face difficulties when reporting local civic problems and tracking what happens after a complaint is submitted.

CivicConnect aims to provide a structured platform for **Palakkad residents** where users can:

* Report civic issues in Palakkad
* Add photos and precise location information
* View reported civic issues
* Upvote issues that affect the community
* Track issue status
* View the resolution progress of reported issues
* Discover nearby civic issues
* Help relevant authorities and departments manage reported issues

---

## Features

### Citizen Features

* User registration and login
* JWT-based authentication
* Report civic issues within Palakkad
* Select issue categories
* Add issue descriptions
* Upload issue photos
* Select issue location using an interactive map
* Location validation within the Palakkad region
* View reported civic issues
* Upvote issues
* View issue status
* View issue resolution timeline
* Discover nearby civic issues

### Administration & Authority Features

* Role-based access control
* Department/authority management
* Issue management
* Issue status updates
* Resolution tracking
* Authority-specific issue access

### Civic Issue Categories

* Potholes
* Streetlights
* Garbage
* Water
* Sanitation
* Drainage
* Other

---

## Geographic Scope

CivicConnect is currently focused on **Palakkad district, Kerala, India**.

The application is designed around the local civic administration context of Palakkad and supports location-based civic issue reporting and discovery within the project’s defined Palakkad boundary.

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Leaflet
* Redux Toolkit
* RTK Query

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Other Technologies

* Cloudinary
* Multer
* REST APIs
* Git & GitHub

---

## Project Structure

```text
civicconnect/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── ...
│
├── .gitignore
├── README.md
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/civicconnect.git
```

### 2. Navigate into the project

```bash
cd civicconnect
```

---

## Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```text
backend/.env
```

Add the required environment variables based on:

```text
backend/.env.example
```

Example structure:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SUPER_ADMIN_EMAIL=your_super_admin_email_address
SUPER_ADMIN_PASSWORD=your_super_admin_password

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

Start the backend:

```bash
npm run server
```

> Use the appropriate backend start command configured in `package.json` if it differs from the example above.

---

## Frontend Setup

Open another terminal and navigate to the project:

```bash
cd civicconnect/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at the local development URL displayed by Vite.

---

## Environment Variables

CivicConnect uses environment variables for sensitive configuration such as:

* MongoDB connection details
* JWT secret
* Cloudinary credentials
* Email configuration
* Other environment-specific settings

A template is provided in:

```text
backend/.env.example
```

---

## API Overview

The backend provides REST APIs for:

* Authentication
* User management
* Civic issue creation and retrieval
* Issue updates
* Issue upvoting
* Issue status tracking
* Resolution timeline
* Nearby issue discovery
* Local body and authority management

API routes are organized within the backend `routes` directory.

---

## Future Improvements

Planned improvements may include:

* Improved authority dashboards
* Notifications
* Additional analytics
* Improved accessibility
* Better mobile responsiveness
* More advanced civic issue discovery
* Additional administrative features
* Further deployment and production improvements
* Expansion to additional regions in the future

---

