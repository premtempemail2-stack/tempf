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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(data.email, data.password, data.name);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to create account. Please try again.');
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
            <p className="text-gray-400 mt-2">Create your account to get started.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Input
              {...register('name')}
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
            />

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

            <Input
              {...register('confirmPassword')}
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
