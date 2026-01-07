'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

function SignUpContent() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(formData.username, formData.email, formData.password);

    if (result.success) {
      router.push(redirectTo);
    } else {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-8 py-16">
      <div className="w-full max-w-[380px]">

        {/* Brand Logo */}
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-black font-sans">The</p>
          <h1 className="text-2xl font-garamond font-bold tracking-tight text-black mt-[-2px]">
            KiawaNoteS
          </h1>
        </div>

        {/* Main Heading */}
        <h2 className="text-[32px] leading-[1.15] font-acaslon text-black mb-6 text-center">
          Create an account
        </h2>

        {/* Legal Text */}
        <p className="text-[13px] text-gray-500 leading-[1.6] mb-8 font-sans text-center">
          By continuing, including through our platform partners, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-black">User Agreement</Link>
          {' '}(including{' '}
          <Link href="/terms" className="underline hover:text-black">class action waiver and arbitration provisions</Link>
          ) and acknowledge our{' '}
          <Link href="/privacy" className="underline hover:text-black">Privacy Policy</Link>.
        </p>

        {error && (
          <Alert variant="destructive" className="border-red-500 bg-red-50 mb-6">
            <AlertDescription className="text-red-600 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="username" className="text-sm font-bold text-black block mb-2">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className="w-full h-[50px] bg-white border border-gray-300 rounded-none px-4 text-base outline-none focus:border-black focus:ring-0 transition-colors font-sans text-black"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-bold text-black block mb-2">
              E-mail address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full h-[50px] bg-white border border-gray-300 rounded-none px-4 text-base outline-none focus:border-black focus:ring-0 transition-colors font-sans text-black"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-bold text-black block mb-2">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full h-[50px] bg-white border border-gray-300 rounded-none px-4 text-base outline-none focus:border-black focus:ring-0 transition-colors font-sans text-black"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-[50px] bg-black text-white hover:bg-black/90 rounded-none text-base font-semibold transition-colors mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-sans">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-black">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <SignUpContent />
    </React.Suspense>
  );
}