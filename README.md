# Omar Zouglah - Personal Portfolio

A modern, multilingual, full-stack portfolio web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🌟 Features

- **Multilingual Support**: English, French, and Arabic (with RTL layout support)
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Fully responsive and mobile-friendly
- **Admin Dashboard**: Protected admin panel for managing projects, skills, and messages
- **JWT Authentication**: Secure authentication system with role-based access control
- **WhatsApp Integration**: Floating WhatsApp button for quick contact
- **Modern UI/UX**: Beautiful, modern design with Framer Motion animations
- **SEO Optimized**: Meta tags and structured data for better SEO

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- React i18next
- React Hot Toast
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- Bcryptjs
- Nodemailer

## 📁 Project Structure

```
Portfolio/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Skill.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── skills.js
│   │   ├── messages.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── WhatsAppFloat.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Experience.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── locales/
│   │   │   ├── en/
│   │   │   ├── fr/
│   │   │   └── ar/
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── i18n.js
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Seed Database (Optional)

To populate the database with sample data:

```bash
cd backend
npm run seed
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get single skill
- `POST /api/skills` - Create skill (Admin)
- `PUT /api/skills/:id` - Update skill (Admin)
- `DELETE /api/skills/:id` - Delete skill (Admin)

### Messages
- `POST /api/messages` - Create message
- `GET /api/messages` - Get all messages (Admin)
- `GET /api/messages/:id` - Get single message (Admin)
- `DELETE /api/messages/:id` - Delete message (Admin)

## 🔐 Admin Access

1. Register a new account at `/register`
2. The first registered user will automatically be assigned the `admin` role
3. Login at `/login` to access the admin dashboard at `/admin`

## 🌍 Language Support

The application supports three languages:
- **English** (en) - Default
- **French** (fr)
- **Arabic** (ar) - With RTL layout support

Language can be switched using the language selector in the navbar.

## 🎨 Customization

### Personal Information

Update personal information in:
- `frontend/src/pages/Home.jsx` - Hero section
- `frontend/src/pages/About.jsx` - About section
- `frontend/src/locales/*/translation.json` - Translation files

### Colors & Styling

Modify Tailwind configuration in `frontend/tailwind.config.js`

### WhatsApp Number

Update WhatsApp number in `frontend/src/components/WhatsAppFloat.jsx`

## 📦 Building for Production

### Backend

The backend is ready for deployment on platforms like Render, Heroku, or Railway.

### Frontend

Build the frontend:
```bash
cd frontend
npm run build
```

The build output will be in the `dist` folder, ready for deployment on Vercel, Netlify, or any static hosting service.

## 🚢 Deployment

### Backend Deployment (Render/Heroku)

1. Set environment variables in your hosting platform
2. Update `FRONTEND_URL` to your frontend URL
3. Update `MONGODB_URI` to your MongoDB Atlas connection string

### Frontend Deployment (Vercel/Netlify)

1. Update `VITE_API_URL` in `.env` to your backend API URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder

## 📄 License

This project is private and proprietary.

## 👤 Author

**Omar Zouglah**
- Email: o.zouglah03@gmail.com
- Phone: +212 707625535
- Location: Casablanca, Morocco

## 🙏 Acknowledgments

- React.js community
- Tailwind CSS
- Framer Motion
- All open-source contributors

---

Built with ❤️ using the MERN stack
