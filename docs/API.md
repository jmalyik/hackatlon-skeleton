# API Documentation

This document describes the API endpoints available in the Hackathon Starter project.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://yourdomain.com`

## Authentication

The API uses Token-based authentication. Include the token in the Authorization header:

```
Authorization: Token <your-token-here>
```

## Interactive Documentation

- **Swagger UI**: `/api/docs/`
- **ReDoc**: `/api/redoc/`
- **OpenAPI Schema**: `/api/schema/`

## Endpoints

### Public Endpoints

#### GET /api/hello/
Test endpoint that doesn't require authentication.

**Response:**
```json
{
  "message": "Hello, World!"
}
```

**Status Codes:**
- `200 OK`: Success

**Example:**
```bash
curl -X GET http://localhost:8000/api/hello/
```

### Authentication Endpoints

#### POST /api/auth/users/
Create a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "password_confirm": "string",
  "first_name": "string",
  "last_name": "string"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "newuser",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Status Codes:**
- `201 Created`: User created successfully
- `400 Bad Request`: Invalid data

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com",
    "password": "strongpassword",
    "password_confirm": "strongpassword",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

#### POST /api/auth/token/login/
Authenticate user and receive token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "auth_token": "token-string-here"
}
```

**Status Codes:**
- `200 OK`: Authentication successful
- `400 Bad Request`: Invalid credentials

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/token/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "strongpassword"
  }'
```

#### POST /api/auth/token/logout/
Logout user and invalidate token.

**Headers:**
```
Authorization: Token <your-token>
```

**Response:**
```json
{}
```

**Status Codes:**
- `204 No Content`: Logout successful
- `401 Unauthorized`: Invalid token

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/token/logout/ \
  -H "Authorization: Token your-token-here"
```

### Protected Endpoints

#### GET /api/hello-dear/
Test endpoint that requires authentication.

**Headers:**
```
Authorization: Token <your-token>
```

**Response:**
```json
{
  "message": "Hello, dear username!",
  "user": "username"
}
```

**Status Codes:**
- `200 OK`: Success
- `401 Unauthorized`: Authentication required

**Example:**
```bash
curl -X GET http://localhost:8000/api/hello-dear/ \
  -H "Authorization: Token your-token-here"
```

#### GET /api/auth/users/me/
Get current user profile.

**Headers:**
```
Authorization: Token <your-token>
```

**Response:**
```json
{
  "id": 1,
  "username": "username",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_staff": false,
  "date_joined": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200 OK`: Success
- `401 Unauthorized`: Authentication required

**Example:**
```bash
curl -X GET http://localhost:8000/api/auth/users/me/ \
  -H "Authorization: Token your-token-here"
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "detail": "Error message here"
}
```

Or for validation errors:

```json
{
  "field_name": [
    "Error message for this field"
  ]
}
```

## Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Request successful, no content to return
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing rate limiting to prevent abuse.

## CORS

The API is configured to allow CORS requests from:
- `http://localhost:8080`
- `http://127.0.0.1:8080`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

## Pagination

For endpoints that return lists of objects, pagination is implemented using Django REST Framework's pagination classes. The response format is:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/endpoint/?page=2",
  "previous": null,
  "results": [
    // ... objects
  ]
}
```

## Filtering and Searching

Some endpoints support filtering and searching through query parameters:

- `?search=query`: Search across multiple fields
- `?field=value`: Filter by specific field value
- `?ordering=field`: Order results by field (use `-field` for descending)

## Expanding the API

To add new endpoints:

1. Create new views in `backend/apps/api/views.py`
2. Add URL patterns to `backend/apps/api/urls.py`
3. Update this documentation

### Example: Adding a new endpoint

```python
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

class MyNewView(APIView):
    permission_classes = [IsAuthenticated]
    
    @extend_schema(description="My new endpoint")
    def get(self, request):
        return Response({"message": "Hello from new endpoint!"})
```

```python
# urls.py
from .views import MyNewView

urlpatterns = [
    path('my-new-endpoint/', MyNewView.as_view(), name='my-new-endpoint'),
    # ... other patterns
]
```

## Testing the API

### Using curl

```bash
# Get token
TOKEN=$(curl -X POST http://localhost:8000/api/auth/token/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}' | jq -r .auth_token)

# Use token
curl -X GET http://localhost:8000/api/hello-dear/ \
  -H "Authorization: Token $TOKEN"
```

### Using Python requests

```python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/token/login/', json={
    'username': 'testuser',
    'password': 'testpass'
})
token = response.json()['auth_token']

# Make authenticated request
headers = {'Authorization': f'Token {token}'}
response = requests.get('http://localhost:8000/api/hello-dear/', headers=headers)
print(response.json())
```

### Using JavaScript fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/token/login/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: 'testuser',
        password: 'testpass'
    })
});
const { auth_token } = await loginResponse.json();

// Make authenticated request
const response = await fetch('http://localhost:8000/api/hello-dear/', {
    headers: {
        'Authorization': `Token ${auth_token}`
    }
});
const data = await response.json();
console.log(data);
```

## Security Considerations

1. **Always use HTTPS in production**
2. **Store tokens securely** (not in localStorage for sensitive applications)
3. **Implement proper token expiration**
4. **Use strong passwords**
5. **Validate all input data**
6. **Implement rate limiting**
7. **Log security events**

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if token is included in Authorization header
2. **403 Forbidden**: User doesn't have permission for this endpoint
3. **400 Bad Request**: Check request body format and required fields
4. **CORS errors**: Ensure frontend origin is in CORS_ALLOWED_ORIGINS

### Debug Mode

In development, set `DJANGO_DEBUG=True` to get detailed error messages. Never use debug mode in production.

## Future Enhancements

Potential API improvements:

1. **JWT tokens** instead of simple tokens
2. **OAuth2 integration** for social login
3. **API versioning** for backward compatibility
4. **Rate limiting** for production use
5. **Pagination** for large datasets
6. **Filtering and searching** capabilities
7. **File upload** endpoints
8. **WebSocket support** for real-time features
