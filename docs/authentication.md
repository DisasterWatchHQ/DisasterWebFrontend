# Authentication System

This document describes the authentication system implemented in the DisasterWatch web application, including user authentication flow, protected routes, and security considerations.

## Overview

The DisasterWatch application implements a JWT-based authentication system with the following features:
- User registration and login
- Protected routes
- Token-based authentication
- Automatic token refresh
- Secure token storage

## Authentication Flow

### 1. User Registration
```typescript
// Example registration flow
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  const { token, user } = response.data;
  login(user, token); // Store token and user data
};
```

### 2. User Login
```typescript
// Example login flow
const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { token, user } = response.data;
  login(user, token); // Store token and user data
};
```

### 3. Token Management
- Tokens are stored in localStorage
- Automatic token validation
- Token expiration handling
- Secure token storage practices

## Protected Routes

### Route Protection Implementation

```typescript
// Higher-order component for protected routes
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { isLoggedIn, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isLoggedIn) {
        router.push('/auth');
      }
    }, [isLoading, isLoggedIn, router]);

    if (isLoading) {
      return <Loading />;
    }

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };
};
```

### Protected Routes List

The following routes require authentication:
- `/dashboard/*`
- `/profile/*`
- `/resources/*`
- `/settings/*`

### Public Routes

These routes are accessible to all users:
- `/`
- `/auth/*`
- `/map`
- `/about`
- `/contact`

## User Context

### UserContext Implementation

```typescript
// UserContext provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check authentication status
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        handleLogout();
        return;
      }

      const userData = JSON.parse(storedUser);
      if (isTokenExpired(token)) {
        handleLogout();
        return;
      }

      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Auth check error:', error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/auth');
  };

  // ... other context methods
};
```

## Security Considerations

### 1. Token Security
- JWT tokens are stored in localStorage
- Tokens are validated on each request
- Automatic token refresh mechanism
- Secure token storage practices

### 2. Password Security
- Passwords are hashed on the server
- Password strength requirements
- Rate limiting on login attempts
- Secure password reset flow

### 3. Session Management
- Automatic session timeout
- Multiple device handling
- Session invalidation on logout
- Secure session storage

### 4. API Security
- HTTPS enforcement
- CORS configuration
- Rate limiting
- Request validation

## Error Handling

### Authentication Errors
```typescript
try {
  await login(credentials);
} catch (error) {
  if (error.response?.status === 401) {
    // Handle invalid credentials
  } else if (error.response?.status === 403) {
    // Handle forbidden access
  } else {
    // Handle other errors
  }
}
```

### Token Expiration
```typescript
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
```

## Best Practices

1. **Token Management**
   - Store tokens securely
   - Implement token refresh
   - Handle token expiration
   - Clear tokens on logout

2. **Route Protection**
   - Use HOC for protected routes
   - Implement loading states
   - Handle authentication errors
   - Redirect appropriately

3. **Security**
   - Use HTTPS
   - Implement rate limiting
   - Validate user input
   - Handle session timeouts

4. **User Experience**
   - Show loading states
   - Provide clear error messages
   - Implement remember me
   - Handle offline scenarios

## Testing

### Authentication Tests
```typescript
describe('Authentication', () => {
  it('should login successfully', async () => {
    // Test login flow
  });

  it('should handle invalid credentials', async () => {
    // Test error handling
  });

  it('should protect routes', () => {
    // Test route protection
  });
});
```

## Troubleshooting

### Common Issues

1. **Token Not Found**
   - Check localStorage
   - Verify token storage
   - Clear browser cache

2. **Authentication Errors**
   - Check API responses
   - Verify credentials
   - Check network connectivity

3. **Protected Route Issues**
   - Verify route configuration
   - Check authentication state
   - Review redirect logic

### Getting Help

- Check the [Issues](https://github.com/yourusername/DisasterWebFrontend/issues) page
- Create a new issue with detailed information
- Join our Discord community for support 