import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email or username' },
        { status: 409 }
      );
    }

    // Create new user - password will be automatically hashed by the pre-save hook
    console.log('Creating user with plain password...');
    const newUser = new User({
      username,
      email,
      password, // Don't hash here - let the model's pre-save hook handle it
      role: 'user' // default role
    });

    // Save user to database - this will trigger the pre-save hook to hash the password
    const savedUser = await newUser.save();
    console.log('User created successfully:', savedUser.email);

    // Generate JWT token for auto-login after registration
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    });

    // Return success response with user data
    return NextResponse.json({
      success: true,
      message: 'User created and logged in successfully',
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle duplicate key error (if unique constraints are in the schema)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }

    if (error.message.includes('Database configuration missing')) {
      return NextResponse.json(
        { success: false, error: 'Server database configuration is missing.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}