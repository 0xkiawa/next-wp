'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

function LoginContent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
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
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen w-full flex bg-[#F2F2F2] dark:bg-[#0a0a0a] overflow-hidden relative font-sans">
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-[0.03]"></div>

      {/* Decorative Blob */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />

      {/* Left Panel - Typography / Aesthetic */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-start px-20 relative z-10 border-r border-neutral-200 dark:border-neutral-800">
        <div className="space-y-6 max-w-lg">
          <h1 className="font-knockout font-bold text-8xl xs:text-9xl leading-[0.8] tracking-tight uppercase text-black dark:text-white">
            Welcome <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-500">Back.</span>
          </h1>
          <p className="font-garamond text-2xl md:text-3xl text-neutral-600 dark:text-neutral-400 italic font-medium leading-relaxed">
            "Culture is the widening of the mind and of the spirit."
          </p>
          <div className="h-1 w-24 bg-black dark:bg-white mt-8"></div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 glass-panel">
        <div className="w-full max-w-md space-y-8 bg-white/60 dark:bg-black/40 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-5xl font-knockout font-bold uppercase tracking-wide text-neutral-900 dark:text-neutral-100">
              Member Access
            </h2>
            <p className="text-neutral-500 font-newyorker text-xl tracking-wide">
              Please enter your details to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="space-y-2 group">
                <Label htmlFor="email" className="font-knockout text-lg uppercase tracking-wider text-neutral-500 ml-1 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  disabled={loading}
                  className="bg-transparent border-0 border-b-2 border-neutral-200 dark:border-neutral-800 rounded-none px-1 h-12 focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white transition-all font-acaslon text-2xl placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="password" className="font-knockout text-lg uppercase tracking-wider text-neutral-500 ml-1 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={loading}
                    className="bg-transparent border-0 border-b-2 border-neutral-200 dark:border-neutral-800 rounded-none px-1 h-12 pr-10 focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white transition-all font-acaslon text-2xl placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-16 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl font-knockout text-2xl uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-xl mt-4"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <p className="font-newyorker text-neutral-500 text-lg">
              Not a member yet?{' '}
              <Link
                href={`/sign-up?redirect=${encodeURIComponent(redirectTo)}`}
                className="font-bold text-black dark:text-white hover:underline decoration-1 underline-offset-4 decoration-neutral-400 font-garamond italic text-xl ml-1"
              >
                Join the community
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
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center font-knockout text-4xl uppercase animate-pulse">Loading...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}