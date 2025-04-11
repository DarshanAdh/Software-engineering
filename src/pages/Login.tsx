
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, loading: isLoading } = useAuth();
  const location = useLocation();
  const [userType, setUserType] = useState<'customer' | 'helper'>(
    (location.state?.userType as 'customer' | 'helper') || 'customer'
  );

  // Form setup
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password, userType);
      // Redirection is handled in the AuthContext login function
    } catch (error) {
      // Error handling is done in the AuthContext
    }
  };

  return (
    <div className="min-h-screen flex flex-col high-quality-image" style={{
      backgroundImage: 'url(/breakdown.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <Navbar />

      <div className="flex-1 container max-w-md mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white text-shadow-lg mb-2">Welcome Back</h1>
          <p className="text-white text-shadow-md">
            Log in to your Roadside Assistance account
          </p>
        </div>

        <div className="backdrop-blur-md bg-white/20 p-8 rounded-lg border border-white/30 shadow-2xl">
          <Tabs value={userType} onValueChange={(v) => setUserType(v as 'customer' | 'helper')}>
            <TabsList className="grid grid-cols-2 w-full bg-white/30 rounded-md mb-6">
              <TabsTrigger value="customer" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium">Customer</TabsTrigger>
              <TabsTrigger value="helper" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium">Helper</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-shadow-sm">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" className="bg-white/70 border-white/30 focus:border-blue-400" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-300 font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-shadow-sm">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" className="bg-white/70 border-white/30 focus:border-blue-400" autoComplete="current-password" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-300 font-medium" />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md mt-2" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
            </Form>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-white text-shadow-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:text-blue-200 hover:underline font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
