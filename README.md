# Hackathon Starter Project

A complete full-stack web application starter with Django backend and SvelteKit frontend, ready for hackathon development.

## Stack Overview

### Backend
- **Django** with **Django REST Framework (DRF)**
- **drf-spectacular** for automatic OpenAPI/Swagger documentation (manual testing & frontend dev reference)
- **djoser** for token-based authentication
- **PostgreSQL** database with **Redis** cache
- **nginx** reverse proxy

### Frontend
- **Plain HTML/CSS/JavaScript** with **Bootstrap CDN** for responsive UI
- Token-based authentication
- No build process - direct file serving for rapid prototyping

## Project Structure

```
hackatlon-skeleton/
├── backend/                    # Django backend
│   ├── config/                # Django settings
│   ├── apps/                  # Django apps
│   │   ├── authentication/    # Custom auth app
│   │   └── api/              # API endpoints
│   ├── requirements.txt       # Python dependencies
│   └── manage.py             # Django management script
├── frontend/                  # Plain HTML/CSS/JS frontend
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── profile.html          # Profile page
│   ├── css/                  # Custom styles
│   │   └── style.css         # Main stylesheet
│   └── js/                   # JavaScript modules
│       ├── auth.js           # Authentication utilities
│       ├── api.js            # API communication
│       └── main.js           # Main application logic
├── docker-compose.yml        # Production setup
├── docker-compose.dev.yml    # Development setup
├── nginx/                    # Nginx configuration
└── docs/                     # Documentation
```

## Development Setup

### Prerequisites
- Python 3.11+
- Docker & Docker Compose
- Git

### Quick Start

1. **Clone and setup**:
   ```bash
   git clone <your-repo>
   cd hackatlon-skeleton
   ```

2. **Backend setup**:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

3. **Frontend setup**:
   Simply open the frontend files in a web browser or serve them with a simple HTTP server:
   ```bash
   cd frontend
   # Option 1: Open index.html directly in browser
   # Option 2: Use Python's built-in server
   python -m http.server 8080
   ```

4. **Access the application**:
   - Frontend: http://localhost:8080 (or directly opening HTML files)
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs/

### Hot Reload
Both frontend and backend support hot reload during development:
- **Frontend**: Automatically reloads on file changes
- **Backend**: Django's development server reloads on Python file changes

## API Endpoints

### Public Endpoints
- `GET /api/hello/` - Public hello endpoint
- `POST /api/auth/users/` - User registration
- `POST /api/auth/token/login/` - User login

### Authenticated Endpoints
- `GET /api/hello-dear/` - Authenticated hello endpoint
- `GET /api/auth/users/me/` - Current user profile
- `POST /api/auth/token/logout/` - User logout

## Production Deployment

### Using Docker Compose

1. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your production settings
   ```

2. **Deploy**:
   ```bash
   docker-compose up -d
   ```

3. **Setup database**:
   ```bash
   docker-compose exec backend python manage.py migrate
   docker-compose exec backend python manage.py createsuperuser
   ```

### Access Production
- Application: http://localhost
- Admin: http://localhost/admin/
- API Documentation: http://localhost/api/docs/

## Features

### Authentication
- Token-based authentication using djoser
- User registration and login
- Role-based access control (admin/user)
- Protected routes and API endpoints

### Frontend Pages
- **Landing Page**: Calls public `/hello` endpoint
- **Login Page**: User authentication
- **Registration Page**: New user signup
- **Profile Page**: Calls authenticated `/hello-dear` endpoint

### Backend Features
- Comprehensive API with OpenAPI documentation
- Admin interface for user management
- Role-based permissions
- Structured Django apps

## Development Commands

### Backend
```bash
# Run development server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test
```

### Frontend
```bash
# Development server
python -m http.server 8080

# Or just open HTML files directly in browser
```

## Docker Commands

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

### Production
```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop production environment
docker-compose down
```

## Environment Variables

Key environment variables for production:
- `DJANGO_SECRET_KEY` - Django secret key
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `DJANGO_DEBUG` - Debug mode (False for production)
- `DJANGO_ALLOWED_HOSTS` - Allowed hosts for Django

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.
