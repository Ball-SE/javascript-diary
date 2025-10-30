# JavaScript Diary ✍️

A modern full‑stack blog/diary application built with React (Vite) and Express, powered by Supabase PostgreSQL. It supports posts with images, categories, comments, likes, real-time notifications, and an admin dashboard.

## Deployed Website
You can check the project at : https://javascript-diary.vercel.app/

### Landing Page
![landing page](https://github.com/user-attachments/assets/573a9722-e2d4-41fe-a4af-6be7753b6ec1)


## 🌟 Features

### Core Functionality
- **Post Management**: Create/read/update/delete posts with image uploads and Markdown-like content
- **Categories: Manage** categories and filter posts by category
- **Likes**: Like system with likes_count per post
- **Comments**: Comment on posts with server-side persistence
  
### Content System
- **Image Uploads**: Upload images to Supabase Storage and get public URLs automatically
- **Post Status**: Support publish status for public listing
- **Pagination**: Query posts with pagination and configurable limits

### Real-time Notifications
- **Live Alerts**: Record events (new posts, comments, likes) into a notifications table
- **Supabase Realtime**: Subscribe to notifications INSERT events and update UI instantly
- **Read Status**: Endpoints to mark a notification as read or mark all as read (admin)

### Admin Dashboard
- **Post Control**: Create/edit/delete posts from an admin interface
- **Category Management**: Create/edit/delete categories
- **Engagement Monitoring**: View notifications for comments and likes
- **Access Control**: Server routes protected by admin middleware

### User Experience
- **Responsive UI**: Tailwind CSS + shadcn/ui + MUI for consistent, accessible design
- **Smooth Navigation**: React Router for SPA routing
- **Friendly Feedback**: Loading states and Lottie animations

### 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Routing**: React Router
- **Styling**: Tailwind CSS + shadcn/ui + MUI
- **Icons & Animations**: Lucide React, Lottie
- **Utilities**: Axios, class-variance-authority, clsx

### Backend & Database
- **Server**: Express
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for images
- **Realtime**: Supabase Realtime (notifications)
- **API**: REST endpoints (e.g., GET /posts, POST /posts, GET /:postId/comments, POST /:postId/like)

### Authentication
- **Provider**: Supabase Auth (JWT)
- **Features**: Sign up, login, get current user, update profile, upload profile picture, reset password
- **Client State**: AuthContext and useAuth manage user/session and token
