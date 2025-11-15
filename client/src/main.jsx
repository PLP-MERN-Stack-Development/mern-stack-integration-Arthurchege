// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PostList from './components/PostList.jsx'; 
import SinglePost from './components/SinglePost.jsx'; 
import PostForm from './components/PostForm.jsx'; 
import Auth from './components/Auth.jsx'; // Auth component handles both Login and Register
import { AuthProvider } from './AuthContext.jsx'; 
import './index.css';


// Define the application's routes
const router = createBrowserRouter([
  {
    path: '/', 
    element: <PostList />,
  },
  {
    path: '/create', 
    element: <PostForm />,
  },
  {
    path: '/posts/:id', 
    element: <SinglePost />,
  },
  {
    path: '/login', // Login route
    element: <Auth isRegister={false} />,
  },
  {
    path: '/register', // 🚨 NEW REGISTER ROUTE
    element: <Auth isRegister={true} />,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);