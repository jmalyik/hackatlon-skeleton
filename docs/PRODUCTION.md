# Production Deployment Guide

This guide covers deploying the Hackathon Starter project to production using Docker.

## Prerequisites

- Docker and Docker Compose installed on your production server
- A domain name (optional, can use IP address)
- SSL certificate (recommended for production)

## Deployment Steps

### 1. Server Setup

1. **Update your server:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Install Docker Compose:**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

### 2. Application Deployment

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd hackatlon-skeleton
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   nano .env
   ```

   Update the following variables:
   ```env
   DJANGO_SECRET_KEY=your-super-secret-key-here
   DATABASE_URL=postgresql://hackathon_user:hackathon_pass@db:5432/hackathon_db
   REDIS_URL=redis://redis:6379/1
   DJANGO_DEBUG=False
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,yourdomain.com
   ```

3. **Start the application:**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations:**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

5. **Create a superuser:**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

6. **Collect static files:**
   ```bash
   docker-compose exec backend python manage.py collectstatic --noinput
   ```

### 3. SSL Configuration (Recommended)

For production, you should use HTTPS. Here's how to set up SSL with Let's Encrypt:

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Update nginx configuration** to include SSL settings in `nginx/nginx.conf`:
   ```nginx
   server {
       listen 80;
       listen 443 ssl;
       server_name yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
       
       # ... rest of configuration
   }
   ```

### 4. Monitoring and Maintenance

#### Health Checks

1. **Check service status:**
   ```bash
   docker-compose ps
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f backend
   docker-compose logs -f nginx
   ```

3. **Check database connection:**
   ```bash
   docker-compose exec backend python manage.py shell
   ```

#### Backup Strategy

1. **Database backup:**
   ```bash
   docker-compose exec db pg_dump -U hackathon_user hackathon_db > backup.sql
   ```

2. **Restore database:**
   ```bash
   docker-compose exec -T db psql -U hackathon_user hackathon_db < backup.sql
   ```

3. **Automated backup script:**
   ```bash
   #!/bin/bash
   # backup.sh
   DATE=$(date +%Y%m%d_%H%M%S)
   docker-compose exec db pg_dump -U hackathon_user hackathon_db > backups/backup_$DATE.sql
   ```

### 5. Security Considerations

1. **Firewall setup:**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **Update Django settings for production:**
   - Set `DEBUG=False`
   - Use strong `SECRET_KEY`
   - Configure `ALLOWED_HOSTS`
   - Set secure headers

3. **Database security:**
   - Use strong passwords
   - Limit database access
   - Regular security updates

### 6. Performance Optimization

1. **Nginx optimization:**
   ```nginx
   # Add to nginx.conf
   gzip on;
   gzip_comp_level 6;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
   
   # Caching
   location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

2. **Database optimization:**
   ```bash
   # Increase shared_buffers in PostgreSQL
   docker-compose exec db psql -U hackathon_user -c "ALTER SYSTEM SET shared_buffers = '256MB';"
   docker-compose restart db
   ```

### 7. Scaling

#### Horizontal Scaling

1. **Load balancer setup:**
   ```nginx
   upstream backend {
       server backend1:8000;
       server backend2:8000;
       server backend3:8000;
   }
   ```

2. **Multiple backend instances:**
   ```yaml
   # docker-compose.yml
   backend1:
     build: ./backend
     environment:
       - DJANGO_SECRET_KEY=your-secret-key
       # ... other env vars
   
   backend2:
     build: ./backend
     environment:
       - DJANGO_SECRET_KEY=your-secret-key
       # ... other env vars
   ```

#### Vertical Scaling

Update resource limits in `docker-compose.yml`:
```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '2.0'
        memory: 2G
      reservations:
        cpus: '1.0'
        memory: 1G
```

### 8. Monitoring

1. **Docker stats:**
   ```bash
   docker stats
   ```

2. **Application monitoring:**
   - Set up Django logging
   - Monitor database queries
   - Track API response times

3. **System monitoring:**
   ```bash
   # Install monitoring tools
   sudo apt install htop iotop
   ```

### 9. Troubleshooting

#### Common Issues

1. **Container won't start:**
   ```bash
   docker-compose logs backend
   docker-compose logs db
   ```

2. **Database connection issues:**
   ```bash
   docker-compose exec backend python manage.py dbshell
   ```

3. **Permission issues:**
   ```bash
   sudo chown -R $USER:$USER .
   ```

4. **Memory issues:**
   ```bash
   # Check memory usage
   free -h
   # Increase swap if needed
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

### 10. Maintenance

#### Regular Tasks

1. **Update dependencies:**
   ```bash
   docker-compose down
   docker-compose pull
   docker-compose up -d
   ```

2. **Clean up Docker:**
   ```bash
   docker system prune -a
   ```

3. **Backup rotation:**
   ```bash
   # Keep only last 7 days of backups
   find backups/ -name "*.sql" -mtime +7 -delete
   ```

#### Security Updates

1. **Keep Docker updated:**
   ```bash
   sudo apt update && sudo apt upgrade docker-ce
   ```

2. **Update base images:**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## Environment-Specific Configurations

### Staging Environment

Use a separate compose file for staging:
```yaml
# docker-compose.staging.yml
version: '3.8'
services:
  backend:
    environment:
      - DJANGO_DEBUG=True
      - DJANGO_ALLOWED_HOSTS=staging.yourdomain.com
```

### Production Environment

Ensure production-ready settings:
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    environment:
      - DJANGO_DEBUG=False
      - DJANGO_ALLOWED_HOSTS=yourdomain.com
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
```

## Additional Resources

- [Docker documentation](https://docs.docker.com/)
- [Django deployment checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Nginx documentation](https://nginx.org/en/docs/)
- [PostgreSQL documentation](https://www.postgresql.org/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
