import jwt from 'jsonwebtoken';
import dbConnect from './dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Updated withAuth middleware to support cookies
export const withAuth = (handler) => {
  return async (request) => {
    try {
      await dbConnect();
      
      let token;
      
      // Try to get token from cookie first, then fallback to Authorization header
      const cookieStore = await cookies();
      const cookieToken = cookieStore.get('auth-token');
      
      if (cookieToken) {
        token = cookieToken.value;
      } else {
        // Fallback to Authorization header for API clients
        const authHeader = request.headers?.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }
      
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Access denied. No token provided.' },
          { status: 401 }
        );
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid token. User not found.' },
          { status: 401 }
        );
      }

      // Attach user to request object
      request.user = user;
      
      // Call the original handler
      return await handler(request);
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json(
          { success: false, error: 'Invalid token.' },
          { status: 401 }
        );
      }
      
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json(
          { success: false, error: 'Token expired.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Authentication error.' },
        { status: 500 }
      );
    }
  };
};

// Middleware to check user roles
export function withRoles(allowedRoles) {
  return function(handler) {
    return withAuth(async (request) => {
      // Check if user has the required role
      if (!allowedRoles.includes(request.user.role)) {
        return NextResponse.json(
          { success: false, error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        );
      }
      
      // Call the handler
      return await handler(request);
    });
  };
}