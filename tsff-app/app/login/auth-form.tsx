'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login, signup } from './actions';

type FormData = {
  email: string;
  password: string;
  name?: string;
};

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: FormData) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (isSignUp && data.name) {
        formData.append('name', data.name);
        signup(formData);
      } else {
        login(formData);
      }
    });
  };

  const toggleMode = () => setIsSignUp(!isSignUp);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
        <CardDescription>
          {isSignUp
            ? 'Create an account to get started'
            : 'Welcome back! Please enter your details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  {...register('name', { required: isSignUp })}
                />
              </div>
              {errors.name && <p className="text-sm text-red-500">Name is required</p>}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">Valid email is required</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register('password', { required: true, minLength: 8 })}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">
                Password is required and must be at least 8 characters
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <Button variant="link" className="p-0" onClick={toggleMode}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
