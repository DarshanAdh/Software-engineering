
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900/80 to-green-900/50">
      <Navbar />

      <div className="flex-1 container max-w-6xl mx-auto px-4 pt-32 pb-16">
        <Card className="w-full max-w-md mx-auto shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">Welcome Back</CardTitle>
            <CardDescription className="text-blue-700">
              Log in to your Roadside Relief account.
            </CardDescription>
          </CardHeader>

          <Tabs value={userType} onValueChange={(v) => setUserType(v as 'customer' | 'helper')}>
            <TabsList className="grid grid-cols-2 w-full bg-blue-100">
              <TabsTrigger value="customer" className="data-[state=active]:bg-accent data-[state=active]:text-white">Customer</TabsTrigger>
              <TabsTrigger value="helper" className="data-[state=active]:bg-accent data-[state=active]:text-white">Helper</TabsTrigger>
            </TabsList>

            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-800">Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" className="border-blue-200 focus:border-accent" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-800">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" className="border-blue-200 focus:border-accent" autoComplete="current-password" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Tabs>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center">
              <p className="text-sm text-blue-700">
                Don't have an account?{' '}
                <Link to="/register" className="text-accent hover:underline font-medium">
                  Register
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
