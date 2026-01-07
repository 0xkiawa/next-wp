'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

function LoginContent() {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email) {
      setStep('password');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      router.push(redirectTo);
    } else {
      setError(result.error || 'Login failed');
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
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Image (50%) */}
      <div className="hidden lg:block w-1/2 relative bg-[#f8f7f4]">
        <Image
          src="/Aristotle.png"
          alt="Artistic illustration"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Right Panel - Form (50%) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-16 bg-white">
        <div className="w-full max-w-[380px]">

          {/* Brand Logo */}
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-black font-sans">The</p>
            <h1 className="text-2xl font-garamond font-bold tracking-tight text-black mt-[-2px]">
              KiawaNoteS
            </h1>
          </div>

          {/* Main Heading */}
          <h2 className="text-[32px] leading-[1.15] font-acaslon text-black mb-6">
            Sign in or create an account
          </h2>

          {/* Legal Text */}
          <p className="text-[13px] text-gray-500 leading-[1.6] mb-8 font-sans">
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

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-sm font-bold text-black block mb-2">
                  E-mail address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-[50px] bg-white border border-gray-300 rounded-none px-4 text-base outline-none focus:border-black focus:ring-0 transition-colors font-sans text-black"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-[50px] bg-black text-white hover:bg-black/90 rounded-none text-base font-semibold transition-colors"
              >
                Continue with e-mail
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="text-sm text-gray-600 mb-4">
                Signing in as <span className="font-semibold text-black">{formData.email}</span>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="ml-2 underline hover:text-black"
                >
                  Change
                </button>
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
                  autoFocus
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[50px] bg-white border border-gray-300 rounded-none px-4 text-base outline-none focus:border-black focus:ring-0 transition-colors font-sans text-black"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-[50px] bg-black text-white hover:bg-black/90 rounded-none text-base font-semibold transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          )}

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 font-sans">
              Don't have an account?{' '}
              <Link href="/sign-up" className="underline hover:text-black">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <LoginContent />
    </React.Suspense>
  );
}