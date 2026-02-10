'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/lib/hooks';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <Card className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white">
              <Sparkles className="w-7 h-7 text-violet-400" />
              WebBuilder
            </Link>
            <p className="text-gray-400 mt-2">Welcome back! Sign in to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="you@example.com"
              error={errors.email?.message}
            />

            <Input
              {...register('password')}
              type="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
