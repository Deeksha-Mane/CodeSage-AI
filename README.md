# CodeSage AI - AI-Powered Code Review Platform

CodeSage AI is a modern web application that provides intelligent code review and analysis using static analysis tools and AI. Get instant feedback on your Python code, track your progress, and improve your coding skills.

## ✨ Features

- **🔍 Static Code Analysis** - Powered by Pylint for comprehensive Python code analysis
- **📊 Analytics Dashboard** - Track your code quality metrics and improvement over time
- **📜 Review History** - Access all your past code reviews and analysis results
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

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/codesage-ai.git
cd codesage-ai
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your MongoDB URL and SECRET_KEY
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

## ⚙️ Configuration

### Backend (.env)
Create a `backend/.env` file with:
```env
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=code_review_ai
SECRET_KEY=your_secret_jwt_key
LLM_PROVIDER=dummy
LLM_API_KEY=your_api_key_here
```

**Important:** 
- Never commit your `.env` file to GitHub
- Generate a secure SECRET_KEY for production
- Use MongoDB Atlas for cloud database or local MongoDB

## 🏃 Running the Application

### Start Backend
```bash
cd backend
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Mac/Linux
python main.py
```
Backend runs on: http://localhost:8000

### Start Frontend
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

## 📖 Usage

1. **Sign Up** - Create a new account
2. **Login** - Access your dashboard
3. **Analyze Code** - Paste Python code and click "Analyze"
4. **View Results** - See issues, explanations, and suggested fixes
5. **Check History** - Review past analyses
6. **Track Progress** - Monitor your improvement in Analytics

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

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- MongoDB Atlas with TLS/SSL
- Environment variables for sensitive data
- CORS configured for frontend origin

## 🚧 Roadmap

- [ ] Real AI/LLM integration (OpenAI, Anthropic)
- [ ] Support for multiple languages (JavaScript, Java, C++)
- [ ] Real-time collaboration
- [ ] Code comparison and diff view
- [ ] GitHub integration
- [ ] VS Code extension
- [ ] Payment integration (Stripe)
- [ ] Team features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Pylint for static code analysis
- FastAPI for the amazing Python framework
- React team for the frontend library
- MongoDB for the database solution

---

**Note:** This is a learning project. For production use, ensure proper security measures, error handling, and testing.
