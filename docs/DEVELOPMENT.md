# Development Guide

This guide will help you set up the development environment for the Hackathon Starter project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11 or higher**
- **Git**
- **Docker & Docker Compose** (for containerized development)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hackatlon-skeleton
```

### 2. Backend Setup

#### Option A: Local Python Environment

1. **Create a virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate the virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

#### Option B: Docker Development

1. **Start the development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Run migrations:**
   ```bash
   docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
   ```

3. **Create a superuser:**
   ```bash
   docker-compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
   ```

### 3. Frontend Setup

The frontend uses plain HTML, CSS, and JavaScript - no build process required!

1. **Option A: Direct file opening**
   - Simply open `frontend/index.html` in your web browser

2. **Option B: Simple HTTP server**
   ```bash
   cd frontend
   python -m http.server 8080
   ```
   Then visit: http://localhost:8080

## Development Workflow

### Hot Reload

- **Backend**: Django's development server automatically reloads when Python files change
- **Frontend**: Browser automatically reloads when HTML/CSS/JS files change (if using live-reload extension)

### API Testing

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Django Admin**: http://localhost:8000/admin/

### Making Changes

1. **Backend Changes**:
   - Edit files in `backend/apps/`
   - Add new models in `models.py`
   - Create new API endpoints in `views.py`
   - Update URL patterns in `urls.py`

2. **Frontend Changes**:
   - Edit HTML files in `frontend/`
   - Update styles in `frontend/css/style.css`
   - Modify JavaScript in `frontend/js/`

3. **Database Changes**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

## Project Structure

```
hackatlon-skeleton/
├── backend/                 # Django backend
│   ├── config/             # Django settings
│   ├── apps/               # Django apps
│   │   ├── authentication/ # Custom auth
│   │   └── api/           # API endpoints
│   ├── requirements.txt    # Python dependencies
│   └── manage.py          # Django management
├── frontend/               # Plain HTML/CSS/JS
│   ├── *.html             # HTML pages
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript
├── docker-compose.yml      # Production
├── docker-compose.dev.yml  # Development
└── nginx/                 # Nginx config
```

## Environment Variables

For development, you can use the default values in `settings.py`. For production, copy `.env.example` to `.env` and update the values.

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Manual Testing
1. Test public API: Visit frontend and click "Test Public API"
2. Test authentication: Register → Login → Visit Profile
3. Test authenticated API: In profile, click "Test Authenticated API"

## Debugging

### Backend Debugging
- Check Django logs in the terminal
- Use Django's debug toolbar (if installed)
- Check `http://localhost:8000/admin/` for data inspection

### Frontend Debugging
- Use browser developer tools (F12)
- Check console for JavaScript errors
- Use network tab to inspect API calls

## Common Issues

### Backend Issues
- **Import errors**: Ensure virtual environment is activated
- **Database errors**: Run migrations with `python manage.py migrate`
- **Permission errors**: Check file permissions

### Frontend Issues
- **CORS errors**: Backend is configured to allow localhost origins
- **API errors**: Check that backend is running on port 8000
- **Authentication errors**: Check token storage in browser localStorage

## Performance Tips

### Development
- Use Django's development server for backend
- Serve frontend files directly for fastest iteration
- Use browser's hard refresh (Ctrl+F5) to clear cache

### Production
- Use proper environment variables
- Enable Django's static file serving
- Use nginx for production serving

## Next Steps

1. **Add new features**: Start with creating new Django apps
2. **Customize UI**: Modify Bootstrap classes and custom CSS
3. **Add more endpoints**: Create new API views and URLs
4. **Implement real-time features**: Consider WebSockets for chat, notifications
5. **Add monitoring**: Integrate logging and monitoring solutions

## Getting Help

- Check the Django documentation: https://docs.djangoproject.com/
- Bootstrap documentation: https://getbootstrap.com/docs/
- Django REST Framework: https://www.django-rest-framework.org/
- MDN Web Docs: https://developer.mozilla.org/

### Django Command-Line Interface (CLI)

Django provides a powerful CLI via the `manage.py` script in your backend directory. You can use it to manage your project, database, and more.

**Common commands:**

- `python manage.py runserver` — Start the development server
- `python manage.py migrate` — Apply database migrations
- `python manage.py makemigrations` — Create new migrations from model changes
- `python manage.py createsuperuser` — Create an admin user
- `python manage.py shell` — Open a Django shell
- `python manage.py test` — Run tests
- `python manage.py collectstatic` — Collect static files for production
- `python manage.py help` — List all available commands

For a full list and details, see the [official Django management commands documentation](https://docs.djangoproject.com/en/stable/ref/django-admin/).
