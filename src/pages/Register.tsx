import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import { MultiSelect } from '@/components/ui/multi-select';

// Customer registration schema
const customerSchema = z.object({
  fullName: z.string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(50, { message: 'Full name must be less than 50 characters' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase(),
  phone: z.string()
    .min(10, { message: 'Phone number must be at least 10 characters' })
    .regex(/^[0-9+\s-()]+$/, { message: 'Please enter a valid phone number' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  driverLicense: z.string()
    .min(5, { message: 'Driver license is required' })
    .regex(/^[A-Z0-9-]+$/, { message: 'Please enter a valid driver license number' }),
  licensePlate: z.string()
    .min(2, { message: 'License plate is required' })
    .regex(/^[A-Z0-9-]+$/, { message: 'Please enter a valid license plate number' }),
  userType: z.literal('customer'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions to register',
  }),
});

// Helper registration schema
const helperSchema = z.object({
  fullName: z.string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(50, { message: 'Full name must be less than 50 characters' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase(),
  phone: z.string()
    .min(10, { message: 'Phone number must be at least 10 characters' })
    .regex(/^[0-9+\s-()]+$/, { message: 'Please enter a valid phone number' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  services: z.array(z.string())
    .min(1, { message: 'Please select at least one service' })
    .max(5, { message: 'You can select up to 5 services' }),
  experience: z.string()
    .min(10, { message: 'Please provide more details about your experience' })
    .max(500, { message: 'Experience description must be less than 500 characters' }),
  vehicleInfo: z.string()
    .min(5, { message: 'Vehicle information is required' })
    .max(100, { message: 'Vehicle information must be less than 100 characters' }),
  userType: z.literal('helper'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions to register',
  }),
});

// Type definitions based on the schema
type CustomerFormValues = z.infer<typeof customerSchema>;
type HelperFormValues = z.infer<typeof helperSchema>;

const Register = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'customer' | 'helper'>('customer');

  // Customer form setup
  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      driverLicense: '',
      licensePlate: '',
      userType: 'customer',
      termsAccepted: false,
    },
  });

  // Helper form setup
  const helperForm = useForm<HelperFormValues>({
    resolver: zodResolver(helperSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      services: [],
      experience: '',
      vehicleInfo: '',
      userType: 'helper',
      termsAccepted: false,
    },
  });

  // Service options for helpers
  const serviceOptions = [
    { label: 'Flat Tire Change', value: 'Flat Tire Change' },
    { label: 'Battery Jump-Start', value: 'Battery Jump-Start' },
    { label: 'Lockout Assistance', value: 'Lockout Assistance' },
    { label: 'Fuel Delivery', value: 'Fuel Delivery' },
    { label: 'Minor Mechanical Help', value: 'Minor Mechanical Help' },
  ];

  // Handle customer registration
  const onSubmitCustomer = async (data: CustomerFormValues) => {
    try {
      await register(data);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  // Handle helper registration
  const onSubmitHelper = async (data: HelperFormValues) => {
    try {
      await register(data);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900/80 to-green-900/50">
      <Navbar />

      <div className="flex-1 container max-w-6xl mx-auto px-4 pt-24 pb-16">
        <Card className="w-full max-w-lg mx-auto shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">Create an Account</CardTitle>
            <CardDescription className="text-blue-700">
              Join Roadside Relief and get help when you need it most.
            </CardDescription>
          </CardHeader>

          <Tabs value={userType} onValueChange={(v) => setUserType(v as 'customer' | 'helper')}>
            <TabsList className="grid grid-cols-2 w-full bg-blue-100">
              <TabsTrigger value="customer" className="data-[state=active]:bg-accent data-[state=active]:text-white">I Need Help</TabsTrigger>
              <TabsTrigger value="helper" className="data-[state=active]:bg-accent data-[state=active]:text-white">I Can Help</TabsTrigger>
            </TabsList>

            <CardContent className="mt-4">
              <TabsContent value="customer">
                <Form {...customerForm}>
                  <form onSubmit={customerForm.handleSubmit(onSubmitCustomer)} className="space-y-4">
                    <FormField
                      control={customerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" className="border-blue-200 focus:border-accent" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={customerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={customerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={customerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={customerForm.control}
                        name="driverLicense"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Driver License</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter driver license" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={customerForm.control}
                        name="licensePlate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Plate</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter license plate" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={customerForm.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I accept the <Link to="#" className="text-accent hover:underline">terms and conditions</Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full mt-2 bg-accent hover:bg-accent/90" disabled={isLoading}>
                      {isLoading ? 'Registering...' : 'Create Customer Account'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="helper">
                <Form {...helperForm}>
                  <form onSubmit={helperForm.handleSubmit(onSubmitHelper)} className="space-y-4">
                    <FormField
                      control={helperForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={helperForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={helperForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={helperForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={helperForm.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Services You Provide</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={serviceOptions}
                              selected={field.value}
                              onChange={field.onChange}
                              placeholder="Select services"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={helperForm.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience</FormLabel>
                          <FormControl>
                            <Input placeholder="Describe your experience" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={helperForm.control}
                      name="vehicleInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Information</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter vehicle make, model, year" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={helperForm.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I accept the <Link to="#" className="text-accent hover:underline">terms and conditions</Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full mt-2 bg-accent hover:bg-accent/90" disabled={isLoading}>
                      {isLoading ? 'Registering...' : 'Create Helper Account'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </CardContent>
          </Tabs>

          <CardFooter className="justify-center">
            <div className="text-center">
              <p className="text-sm text-blue-700">
                Already have an account?{' '}
                <Link to="/login" className="text-accent hover:underline font-medium">
                  Log in
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

export default Register;
