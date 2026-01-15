# Backend Health Check Implementation

## Overview

This document describes the comprehensive health check system implemented for the Advancia backend platform. The system provides detailed system monitoring, resource tracking, and Kubernetes-style health probes.

## Available Endpoints

### 1. Comprehensive Health Check
**Endpoint:** `GET /api/health/`

**Description:** Returns detailed system health information including services, resources, and dependencies.

**Response Format:**
```json
{
  "status": "healthy|unhealthy",
  "timestamp": "2026-01-14T19:05:00.000Z",
  "version": "1.0.0",
  "environment": "development|production",
  "checks": {
    "database": {
      "status": "healthy|unhealthy",
      "message": "Database connection successful"
    },
    "services": {
      "database": true,
      "stripe": true,
      "nowpayments": true,
      "alchemy": true,
      "email": true,
      "sms": true
    },
    "memory": {
      "status": "healthy|warning",
      "used_percent": 45.67
    },
    "disk_space": {
      "status": "healthy|warning",
      "free_percent": 85.32
    },
    "cpu": {
      "status": "healthy|warning",
      "usage_percent": 23.45,
      "load_average": [0.5, 0.4, 0.3]
    }
  },
  "system": {
    "uptime": 3600,
    "platform": "linux|darwin|win32",
    "arch": "x64",
    "node_version": "v18.17.0",
    "memory": {
      "used_percent": 45.67,
      "total": 8589934592,
      "used": 3925868544,
      "free": 4664066048
    },
    "disk": {
      "free_percent": 85.32,
      "total": 1000000000000,
      "used": 146800000000,
      "free": 853200000000
    },
    "cpu": {
      "usage_percent": 23.45,
      "load_average": [0.5, 0.4, 0.3]
    }
  },
  "features": {
    "cards": { "enabled": true, "fallback": false },
    "conversion": { "enabled": true, "fallback": false },
    "notifications": { "enabled": true, "fallback": false }
  },
  "circuitBreakers": {
    "stripe": "CLOSED|OPEN|HALF_OPEN",
    "database": "CLOSED|OPEN|HALF_OPEN"
  },
  "criticalFailure": false,
  "warnings": [],
  "success": true,
  "message": "All systems operational"
}
```

**Status Codes:**
- `200` - All systems healthy
- `503` - System issues detected

### 2. Kubernetes Readiness Probe
**Endpoint:** `GET /api/health/ready`

**Description:** Kubernetes-style readiness check. Returns 200 when service is ready to accept traffic.

**Response Format:**
```json
{
  "ready": true,
  "checks": {
    "database": true,
    "database_circuit": true,
    "memory": true,
    "disk": true
  },
  "timestamp": "2026-01-14T19:05:00.000Z"
}
```

**Status Codes:**
- `200` - Service ready to accept traffic
- `503` - Service not ready

### 3. Kubernetes Liveness Probe
**Endpoint:** `GET /api/health/live`

**Description:** Kubernetes-style liveness check. Returns 200 if the application is running.

**Response Format:**
```json
{
  "alive": true,
  "timestamp": "2026-01-14T19:05:00.000Z",
  "uptime": 3600,
  "memory": {
    "heap_used_mb": 45,
    "heap_total_mb": 67,
    "external_mb": 23
  },
  "pid": 12345
}
```

**Status Codes:**
- `200` - Application is alive
- `503` - Application is not responding or has memory issues

### 4. Kubernetes Startup Probe
**Endpoint:** `GET /api/health/startup`

**Description:** Kubernetes-style startup probe for applications with long initialization.

**Response Format:**
```json
{
  "started": true,
  "uptime": 15,
  "checks": {
    "database_connection": true,
    "environment_config": true
  },
  "timestamp": "2026-01-14T19:05:00.000Z"
}
```

**Status Codes:**
- `200` - Application has started successfully
- `503` - Application is still starting or failed to start

### 5. Individual Service Check
**Endpoint:** `GET /api/health/service/:serviceName`

**Description:** Check the health of a specific service.

**Available Services:**
- `database`
- `stripe`
- `nowpayments`
- `alchemy`
- `email`
- `sms`

**Response Format:**
```json
{
  "success": true,
  "service": "database",
  "healthy": true,
  "status": "healthy|unhealthy|error|unknown",
  "lastCheck": 1705261500000,
  "critical": true
}
```

### 6. Service Recovery
**Endpoint:** `POST /api/health/recover/:serviceName`

**Description:** Trigger recovery for a specific service.

**Response Format:**
```json
{
  "success": true,
  "service": "database",
  "message": "Service recovered successfully"
}
```

### 7. Circuit Breaker Control
**Endpoint:** `POST /api/health/circuit-breaker/:service/reset`

**Description:** Reset a circuit breaker for a specific service.

**Response Format:**
```json
{
  "success": true,
  "message": "Circuit breaker for database has been reset",
  "state": "CLOSED"
}
```

### 8. Feature Toggle Control
**Endpoint:** `POST /api/health/feature/:featureName/:action`

**Description:** Enable or disable a feature flag.

**Actions:** `enable`, `disable`

**Available Features:**
- `cards`
- `conversion`
- `notifications`
- `payments`
- `kyc`
- `analytics`
- `email`
- `sms`

**Response Format:**
```json
{
  "success": true,
  "feature": "cards",
  "enabled": true
}
```

### 9. System Resilience Status
**Endpoint:** `GET /api/health/resilience`

**Description:** Get comprehensive resilience status including features, services, and circuit breakers.

**Response Format:**
```json
{
  "success": true,
  "resilience": {
    "features": {
      "cards": { "enabled": true, "fallback": false }
    },
    "services": {
      "database": {
        "status": "healthy",
        "critical": true,
        "lastCheck": 1705261500000
      }
    },
    "circuitBreakers": {
      "stripe": "CLOSED",
      "database": "CLOSED"
    }
  },
  "summary": {
    "degradedFeatures": [],
    "unhealthyServices": [],
    "openCircuits": [],
    "systemStatus": "fully_operational|degraded"
  },
  "timestamp": "2026-01-14T19:05:00.000Z"
}
```

## Health Check Thresholds

### Memory Monitoring
- **Warning:** >90% memory usage
- **Critical:** >95% memory usage (affects readiness)
- **Liveness Failure:** >2GB heap usage (potential memory leak)

### Disk Space Monitoring
- **Warning:** <10% free space
- **Critical:** <5% free space (affects readiness)

### CPU Monitoring
- **Warning:** >95% CPU usage
- **Load Average:** Tracked for system performance analysis

## Integration with Kubernetes

### Deployment Configuration Example
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: advancia-backend
spec:
  template:
    spec:
      containers:
      - name: backend
        image: advancia/backend:latest
        livenessProbe:
          httpGet:
            path: /api/health/live
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/health/ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        startupProbe:
          httpGet:
            path: /api/health/startup
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 30
```

## Monitoring and Alerting

### Prometheus Metrics Integration
The health check system can be extended to export metrics for Prometheus:
- System resource usage
- Service availability
- Circuit breaker states
- Feature flag status

### Alerting Rules
Recommended alerting rules:
1. **Critical:** Any service marked as critical is unhealthy
2. **Warning:** Memory usage >90% for >5 minutes
3. **Warning:** Disk space <10% for >1 minute
4. **Info:** Circuit breaker opens

## Graceful Degradation

### Feature Flags
The system includes feature flags that can automatically disable features when their dependencies become unhealthy:
- Non-critical services automatically enable fallback mode
- Critical services disable dependent features
- Manual override available via API

### Circuit Breakers
Circuit breakers protect the system from cascading failures:
- Automatic opening when services fail
- Half-open state for testing recovery
- Manual reset capability

## Security Considerations

### Access Control
Health check endpoints should be:
- Protected in production environments
- Accessible only to monitoring systems and authorized personnel
- Rate limited to prevent abuse

### Information Disclosure
The comprehensive health check may expose sensitive system information:
- Consider different detail levels for different access levels
- Sanitize error messages in production
- Log access to health check endpoints

## Testing the Implementation

### Manual Testing
```bash
# Test comprehensive health check
curl -X GET http://localhost:3001/api/health/

# Test readiness probe
curl -X GET http://localhost:3001/api/health/ready

# Test liveness probe
curl -X GET http://localhost:3001/api/health/live

# Test startup probe
curl -X GET http://localhost:3001/api/health/startup

# Test specific service
curl -X GET http://localhost:3001/api/health/service/database

# Test resilience status
curl -X GET http://localhost:3001/api/health/resilience
```

### Load Testing
Use tools like `k6` or `artillery` to test health check endpoints under load to ensure they remain responsive during high traffic.

## Troubleshooting

### Common Issues
1. **Database Connection Failures:** Check database connectivity and credentials
2. **Memory Warnings:** Monitor memory usage patterns and potential leaks
3. **Circuit Breaker Issues:** Review service response times and error rates

### Debugging
Enable debug logging for health check system:
```bash
DEBUG=health:* npm start
```

## Future Enhancements

### Planned Features
1. **Metrics Export:** Prometheus/Grafana integration
2. **Historical Data:** Store health check history
3. **Dependency Mapping:** Visual service dependency graph
4. **Auto-scaling Integration:** Trigger scaling based on health metrics
5. **Advanced Alerting:** Integration with PagerDuty/Slack
6. **Health Score:** Composite health score calculation

### Performance Optimizations
1. **Caching:** Cache health check results for non-critical checks
2. **Async Checks:** Parallelize service health checks
3. **Selective Monitoring:** Enable/disable specific checks based on environment
