# CodeSage AI - AI-Powered Code Review Platform

CodeSage AI is a modern web application that provides intelligent code review and analysis using static analysis tools and AI. Get instant feedback on your Python code, track your progress, and improve your coding skills.

## ✨ Features

- **🔍 Static Code Analysis** - Powered by Pylint for comprehensive Python code analysis
- **📊 Analytics Dashboard** - Track your code quality metrics and improvement over time
- **📜 Review History** - Access all your past code reviews and analysis results
- **📥 Export Reports** - Download analysis as Text or Markdown files
- **🎨 Multiple Themes** - Choose from 5 beautiful themes (Light, Dark, Blue Ocean, Purple Dream, Green Forest)
- **🔐 Secure Authentication** - JWT-based authentication with MongoDB Atlas
- **👤 Profile Management** - Update profile, change password, manage account
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Tech Stack

### Frontend
- React 18
- React Router v6
- React Icons
- CSS3 with CSS Variables for theming

### Backend
- FastAPI (Python)
- MongoDB Atlas (Cloud Database)
- Pylint (Static Code Analysis)
- JWT Authentication
- Bcrypt Password Hashing

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB Atlas account (or local MongoDB)

## 🛠️ Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/CodeSage-AI.git
cd CodeSage-AI
```

### Step 2: Backend Setup

#### 2.1 Navigate to backend folder
```bash
cd backend
```

#### 2.2 Create virtual environment
```bash
python -m venv venv
```

#### 2.3 Activate virtual environment
**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

#### 2.4 Install Python dependencies
```bash
pip install -r requirements.txt
```

#### 2.5 Configure environment variables
Create a `.env` file in the `backend` folder (copy from `.env.example`):
```env
MONGODB_URL=your_mongodb_atlas_connection_string
DATABASE_NAME=code_review_ai
SECRET_KEY=your_secret_jwt_key_here
LLM_PROVIDER=dummy
LLM_API_KEY=your_api_key_here
```

**Important Notes:**
- Get MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Generate a secure SECRET_KEY (use: `openssl rand -hex 32`)
- Never commit `.env` file to GitHub
- All team members must use the SAME SECRET_KEY for JWT tokens to work

### Step 3: Frontend Setup

#### 3.1 Open a new terminal and navigate to frontend folder
```bash
cd frontend
```

#### 3.2 Install Node dependencies
```bash
npm install
```

## 🏃 Running the Application

You need to run both backend and frontend simultaneously in separate terminals.

### Terminal 1: Start Backend Server

```bash
# Navigate to backend folder
cd backend

# Activate virtual environment (Windows)
venv\Scripts\activate

# Start FastAPI server
uvicorn main:app --reload
```

✅ Backend will run on: **http://localhost:8000**

### Terminal 2: Start Frontend Server

```bash
# Navigate to frontend folder
cd frontend

# Start React development server
npm start
```

✅ Frontend will run on: **http://localhost:3000**

### First Time Setup

1. **Create MongoDB Atlas Account** (if you don't have one)
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Whitelist your IP address (or use 0.0.0.0/0 for development)
   - Get your connection string

2. **Configure Backend**
   - Copy `.env.example` to `.env`
   - Add your MongoDB connection string
   - Generate and add a SECRET_KEY

3. **Start Both Servers**
   - Terminal 1: Backend (port 8000)
   - Terminal 2: Frontend (port 3000)

### Using the Application

1. **Sign Up** - Create a new account with name, email, and password
2. **Login** - Access your personalized dashboard
3. **Analyze Code** 
   - Paste your Python code in the editor
   - Click "Analyze Code" button
   - View issues with explanations and suggested fixes
4. **Export Results** - Download analysis as Text or Markdown
5. **View History** - Access all your past code reviews
6. **Check Analytics** - Monitor your code quality metrics and improvement
7. **Customize Theme** - Choose from 5 themes in Settings
8. **Manage Profile** - Update name, change password, or delete account

## 🎨 Themes

CodeSage AI includes 5 beautiful themes:
- **Light** - Clean and bright
- **Dark** - Easy on the eyes
- **Blue Ocean** - Calm and professional
- **Purple Dream** - Creative and vibrant
- **Green Forest** - Natural and soothing

Change themes in Dashboard → Settings

## 📁 Project Structure

```
codesage-ai/
├── backend/
│   ├── analyzer/          # Pylint integration
│   ├── auth/              # Authentication handlers
│   ├── feedback/          # Feedback management
│   ├── history/           # Review history
│   ├── llm/               # LLM provider abstraction
│   ├── config.py          # Configuration
│   ├── main.py            # FastAPI application
│   ├── models.py          # Pydantic models
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── ThemeContext.js
│   │   └── themes.css     # Theme definitions
│   └── package.json       # Node dependencies
└── README.md
```
