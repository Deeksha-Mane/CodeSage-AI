# ⚡ QUICK START (For Experienced Developers)

## Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB (Atlas or Local)

## Setup (5 minutes)

```bash
# 1. Backend
cd backend
python -m venv venv
venv\Scripts\activate  
pip install -r requirements.txt
uvicorn main:app --reload

# 4. Frontend (new terminal)
cd frontend
npm install
npm start
```

## Test
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Click "Load Sample" → "Analyze Code"

## Verify Setup
```bash
python test_setup.py
```

---