# 🔄 MERN Stack Blog Integration Project

## 🚀 Project Overview

This project is a full-stack blog application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The primary objective was to demonstrate **seamless integration** between all components, robust **RESTful API design**, and implementation of **advanced features** including user authentication, protected routes, and file uploads.

### Key Features Implemented

- **Full CRUD Functionality:** Create, Read, Update, and Delete operations for Blog Posts.
- **Authentication & Security:** User Registration and Login secured with **JWT (JSON Web Tokens)**.
- **Protected Routes:** Post creation, updating, and deletion are restricted to authenticated users via Express middleware.
- **Nested Resources:** Implementation of a **Comments** feature linked securely to both the Post and the authenticated User.
- **File Uploads:** Integration of the **`multer`** library on the server to handle image uploads for post featured images.
- **State Management:** Front-end state managed using React Hooks (`useState`, `useEffect`) and a custom **`useApi` hook** for centralized data fetching and error handling.
- **Routing:** Client-side navigation handled via **React Router DOM**.

---

## 🛠️ Setup Instructions

Follow these steps in your terminal to get the client and server running simultaneously.

### Prerequisites

- Node.js (v18+) and npm
- MongoDB Server (Local or MongoDB Atlas)

### 1. Database and Environment Setup

1.  **Server Dependencies:** Navigate to the `server` directory and install packages.
    ```bash
    cd server
    npm install
    ```
2.  **Environment Variables (`server/.env`):** Create a `.env` file in the `server` directory.
    ```
    MONGODB_URI=mongodb://localhost:27017/mern_blog_db
    PORT=5000
    NODE_ENV=development
    JWT_SECRET=super-secure-key-for-project-testing-12345
    JWT_EXPIRE=30d
    ```
3.  **Start the Backend:** Keep this terminal window running.
    ```bash
    node server.js
    ```

### 2. Client Setup

1.  **Client Dependencies:** Navigate to the `client` directory and install packages.
    ```bash
    cd client
    npm install
    ```
2.  **Start the Frontend:** Open a **new terminal window** and run the client.
    ```bash
    npm run dev
    ```
3.  **Access:** Open your browser to the provided Vite URL (usually `http://localhost:5173/`).

---

## 🔒 Initial User Setup & API Endpoints

### Initial User Setup

1.  **Register:** Navigate to the `/register` route in the browser and create a new user account.
2.  **Login:** Use the new credentials at the `/login` route. This action stores the JWT token in your browser, enabling access to all protected routes (POST, PUT, DELETE) on the client side.

### API Documentation (Base URL: `/api`)

| Resource     | Method     | Endpoint                  | Access      | Description                                                   |
| :----------- | :--------- | :------------------------ | :---------- | :------------------------------------------------------------ |
| **Auth**     | POST       | `/auth/register`          | Public      | Registers a new user.                                         |
| **Auth**     | POST       | `/auth/login`             | Public      | Logs in user and returns **JWT Token**.                       |
| **Posts**    | GET        | `/posts`                  | Public      | Get all blog posts.                                           |
| **Posts**    | POST       | `/posts`                  | **Private** | Create a new post (Requires `Authorization: Bearer <token>`). |
| **Posts**    | GET        | `/posts/:id`              | Public      | Get a specific post.                                          |
| **Posts**    | PUT/DELETE | `/posts/:id`              | **Private** | Update/Delete a specific post.                                |
| **Comments** | GET        | `/posts/:postId/comments` | Public      | Get all comments for a post.                                  |
| **Comments** | POST       | `/posts/:postId/comments` | **Private** | Add a comment to a post.                                      |

---

## 🎨 Client-Side Views

- **Homepage (`/`):** Displays all posts, Login/Logout buttons, and a link to the Create Post form.
- **Single Post View (`/posts/:id`):** Displays full post content, featured image, and includes the Comment Submission form and Comment List.
- **Create View (`/create`):** Form for creating posts, supporting text input and file upload (`featuredImage`).
- **Auth Views (`/login`, `/register`):** Forms for handling user authentication.
