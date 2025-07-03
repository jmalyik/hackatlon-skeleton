# Windows Development Setup Guide

This guide provides Windows-specific setup instructions for the Hackathon Starter project.

## Prerequisites

- **Python 3.11 or higher** (Download from [python.org](https://www.python.org/downloads/))
- **Git** (Download from [git-scm.com](https://git-scm.com/))
- **Docker Desktop** (Optional, for production simulation)

## Quick Setup for Windows

### 1. Clone the Repository

```powershell
git clone <your-repo-url>
cd hackatlon-skeleton
```

### 2. Backend Setup (Easy Mode)

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements-dev.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3. Frontend Setup (New Terminal)

```powershell
cd frontend
python -m http.server 8080
```

### 4. Access the Application

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs/
- Admin: http://localhost:8000/admin/

## What's Different for Windows?

### Database
- **Development**: Uses SQLite (no PostgreSQL installation needed)
- **Production**: Still uses PostgreSQL in Docker

### Cache
- **Development**: Uses dummy cache (no Redis installation needed)
- **Production**: Still uses Redis in Docker

### Dependencies
- **requirements-dev.txt**: Simplified dependencies for Windows development
- **requirements.txt**: Full production dependencies

## Common Windows Issues & Solutions

### Issue 1: Python not found
```powershell
# Make sure Python is in PATH
python --version
# If not found, reinstall Python and check "Add to PATH"
```

### Issue 2: Virtual environment activation fails
```powershell
# If PowerShell execution policy blocks scripts:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Then try activating again:
venv\Scripts\activate
```

### Issue 3: PostgreSQL/psycopg2 errors
```powershell
# Use the development requirements instead:
pip install -r requirements-dev.txt
# This avoids PostgreSQL dependencies
```

### Issue 4: Port already in use
```powershell
# Find process using port 8000:
netstat -ano | findstr :8000
# Kill the process (replace PID with actual process ID):
taskkill /PID <PID> /F
```

## Development Workflow

1. **Start backend** (Terminal 1):
   ```powershell
   cd backend
   venv\Scripts\activate
   python manage.py runserver
   ```

2. **Start frontend** (Terminal 2):
   ```powershell
   cd frontend
   python -m http.server 8080
   ```

3. **Make changes** and refresh browser - both backend and frontend support hot reload!

## Production Deployment (Docker)

If you want to test the full production setup on Windows:

1. **Install Docker Desktop**
2. **Run production setup**:
   ```powershell
   docker-compose up -d
   docker-compose exec backend python manage.py migrate
   docker-compose exec backend python manage.py createsuperuser
   ```

## IDE Recommendations

- **VS Code** with Python extension
- **PyCharm Community Edition**
- **Sublime Text** with Python packages

## Troubleshooting

### Reset Everything
```powershell
# Remove virtual environment
rmdir /s venv
# Delete database
del db.sqlite3
# Start fresh
python -m venv venv
venv\Scripts\activate
pip install -r requirements-dev.txt
python manage.py migrate
python manage.py createsuperuser
```

### Check Installation
```powershell
# Test backend
curl http://localhost:8000/api/hello/
# Or use PowerShell:
Invoke-RestMethod -Uri http://localhost:8000/api/hello/
```

## Next Steps

Once you have the basic setup working:

1. **Customize the frontend** - edit HTML/CSS/JS files
2. **Add new API endpoints** - modify `backend/apps/api/views.py`
3. **Create new models** - add to `backend/apps/api/models.py`
4. **Style the UI** - update `frontend/css/style.css`

## Getting Help

If you encounter issues:
1. Check this guide first
2. Look at the main README.md
3. Check the Django documentation
4. Search for error messages on Stack Overflow
