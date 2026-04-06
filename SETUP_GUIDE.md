# Setup Guide - Without Docker

## Prerequisites

1. **Python 3.9+** - [Download Python](https://www.python.org/downloads/)
2. **Node.js 16+** - [Download Node.js](https://nodejs.org/)
3. **MongoDB** - Choose one option:
   - **Option A (Easiest)**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free cloud database)
   - **Option B**: [Install MongoDB locally](https://www.mongodb.com/try/download/community)

## Step-by-Step Setup

### Step 1: Install MongoDB

#### Option A: MongoDB Atlas (Recommended for beginners)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Save this for Step 3

#### Option B: Local MongoDB
1. Download and install MongoDB Community Edition
2. Start MongoDB service:
   - Windows: MongoDB runs automatically after install
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### Step 2: Setup Backend

Open a terminal and run:

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
# In backend folder
cd backend
# Copy the example file
cp .env.example .env
```

Now edit `backend/.env` with your settings:

**For MongoDB Atlas:**
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=code_review_ai
LLM_PROVIDER=dummy
```

**For Local MongoDB:**
```env
MONGODB_URL=mongodb://localhost:27017/
DATABASE_NAME=code_review_ai
LLM_PROVIDER=dummy
```

⚠️ **IMPORTANT**: Never commit the `.env` file to Git! It's already in `.gitignore`

### Step 4: Start Backend Server

```bash
# Make sure you're in the backend folder with venv activated
uvicorn main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Test it: Open browser and go to http://localhost:8000
You should see: `{"message": "Code Review AI API", "status": "running"}`

### Step 5: Setup Frontend

Open a **NEW terminal** (keep backend running) and run:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (this may take a few minutes)
npm install
```

### Step 6: Start Frontend

```bash
# Make sure you're in the frontend folder
npm start
```

The browser should automatically open to http://localhost:3000

## Verify Everything Works

1. **Frontend**: Should see the Code Review AI interface at http://localhost:3000
2. **Backend**: Should be running at http://localhost:8000
3. **Test the app**:
   - Click "Load Sample" button
   - Click "Analyze Code"
   - You should see issues appear on the right side
   - Click the feedback buttons (👍 Yes / 👎 No)

## Common Issues & Solutions

### Issue: "Module not found" error in backend
**Solution:** Make sure virtual environment is activated and run:
```bash
pip install -r requirements.txt
```

### Issue: "Port 8000 already in use"
**Solution:** Kill the process using port 8000:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### Issue: Frontend can't connect to backend
**Solution:** 
1. Make sure backend is running on http://localhost:8000
2. Check browser console for CORS errors
3. Verify backend shows "Application startup complete"

### Issue: MongoDB connection error
**Solution:**
- For Atlas: Check username/password in connection string
- For Local: Make sure MongoDB service is running
- Test connection: `mongosh` (should connect without errors)

## Development Workflow

### Daily Development
1. Open 2 terminals
2. Terminal 1: Start backend
   ```bash
   cd backend
   venv\Scripts\activate  # or source venv/bin/activate
   uvicorn main:app --reload
   ```
3. Terminal 2: Start frontend
   ```bash
   cd frontend
   npm start
   ```

### Stopping the Application
- Press `Ctrl+C` in both terminals
- Deactivate virtual environment: `deactivate`