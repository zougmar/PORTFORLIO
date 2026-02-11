# Quick Setup Guide

## Step 1: Install Dependencies

### Install Backend Dependencies
```bash
cd backend
npm install
```

### Install Frontend Dependencies
```bash
cd frontend
npm install
```

Or install all at once from root:
```bash
npm run install-all
```

## Step 2: Configure Environment Variables

### Backend Configuration

1. Copy `backend/env.example.txt` to `backend/.env`
2. Update the following values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret key for JWT tokens
   - `EMAIL_USER` and `EMAIL_PASS`: Your email credentials (for contact form)

### Frontend Configuration

1. Copy `frontend/env.example.txt` to `frontend/.env`
2. Update `VITE_API_URL` if your backend runs on a different port

## Step 3: Start MongoDB

Make sure MongoDB is running on your system or use MongoDB Atlas.

## Step 4: Seed Database (Optional)

To populate with sample data:
```bash
cd backend
npm run seed
```

## Step 5: Start Development Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## Step 6: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Step 7: Create Admin Account

1. Navigate to http://localhost:3000/register
2. Register a new account (first user becomes admin)
3. Login at http://localhost:3000/login
4. Access admin dashboard at http://localhost:3000/admin

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, whitelist your IP address

### Port Already in Use
- Change `PORT` in backend `.env`
- Update `VITE_API_URL` in frontend `.env` accordingly

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
