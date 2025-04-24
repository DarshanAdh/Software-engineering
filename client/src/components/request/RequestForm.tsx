import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Car, Battery, Wrench, KeyRound, Fuel } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { requestAPI } from '@/services/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userAPI } from '@/services/api';
import LocationPicker from '@/components/ui/map/LocationPicker';

interface ServiceType {
  id: 'tow' | 'fuel' | 'tire' | 'battery' | 'lockout' | 'other';
  name: string;
  icon: React.ReactNode;
  description: string;
  price: number;
}

// Mapping between display names and enum values
const serviceNameToEnum: Record<string, 'tow' | 'fuel' | 'tire' | 'battery' | 'lockout' | 'other'> = {
  'Flat Tire Change': 'tire',
  'Battery Jump-Start': 'battery',
  'Lockout Assistance': 'lockout',
  'Fuel Delivery': 'fuel',
  'Minor Mechanical Help': 'other',
  'Tow Service': 'tow'
};

// Step 2 form validation schema
const userInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Location is required"),
  latitude: z.number(),
  longitude: z.number(),
  vehicle: z.string().min(3, "Vehicle information is required"),
  details: z.string().optional(),
});

type UserInfoValues = z.infer<typeof userInfoSchema>;

interface RequestFormProps {
  onLocationSelect?: (location: { latitude: number; longitude: number; address: string }) => void;
}

const RequestForm = ({ onLocationSelect }: RequestFormProps) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<{ fullName: string; phone: string } | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const navigate = useNavigate();

  const form = useForm<UserInfoValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      latitude: 0,
      longitude: 0,
      vehicle: "",
      details: "",
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await userAPI.getProfile();
        setUserProfile(profile);
        // Pre-fill the form with user data
        form.setValue('fullName', profile.fullName);
        form.setValue('phone', profile.phone);
        // Set default values for other fields
        form.setValue('address', '');
        form.setValue('vehicle', '');
        form.setValue('details', '');
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [form]);

  const serviceTypes: ServiceType[] = [
    {
      id: "tire",
      name: "Flat Tire Change",
      icon: <Car className="h-5 w-5" />,
      description: "Replace your flat tire with your spare tire",
      price: 30,
    },
    {
      id: "battery",
      name: "Battery Jump-Start",
      icon: <Battery className="h-5 w-5" />,
      description: "Jump-start your vehicle's dead battery",
      price: 25,
    },
    {
      id: "lockout",
      name: "Lockout Assistance",
      icon: <KeyRound className="h-5 w-5" />,
      description: "Help when you're locked out of your vehicle",
      price: 35,
    },
    {
      id: "fuel",
      name: "Fuel Delivery",
      icon: <Fuel className="h-5 w-5" />,
      description: "Emergency fuel delivery when you run out",
      price: 40,
    },
    {
      id: "other",
      name: "Minor Mechanical Help",
      icon: <Wrench className="h-5 w-5" />,
      description: "Basic troubleshooting and minor repairs",
      price: 45,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1 && selectedService) {
      setStep(2);
      return;
    }
  };

  const onSubmitUserInfo = async (data: UserInfoValues) => {
    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No authentication token found");
        toast.error("Please login to request help");
        setLoading(false);
        navigate('/login');
        return;
      }

      // Check if user is a customer
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.userType !== 'customer') {
        console.error("User is not a customer:", tokenPayload.userType);
        toast.error("Only customers can create requests");
        setLoading(false);
        navigate('/dashboard');
        return;
      }

      // Get selected service
      const selectedService = getSelectedService();
      if (!selectedService) {
        console.error("No service selected");
        toast.error("Please select a service");
        setLoading(false);
        return;
      }

      // Map the service name to the enum value
      const serviceType = serviceNameToEnum[selectedService.name];
      if (!serviceType) {
        console.error("Invalid service type:", selectedService.name);
        toast.error("Invalid service type selected");
        setLoading(false);
        return;
      }

      // Prepare request data
      const requestData = {
        serviceType,
        description: data.details || `Help needed with ${selectedService.name}`,
        location: {
          type: 'Point' as const,
          coordinates: [data.longitude, data.latitude] as [number, number],
          address: data.address
        },
        isUrgent: false,
        estimatedPrice: selectedService.price,
        vehicle: data.vehicle
      };

      console.log("Submitting request with data:", requestData);

      // Use the API service to create the request
      const result = await requestAPI.createRequest(requestData);
      console.log("Request created successfully:", result);

      toast.success("Help request submitted successfully! An assistant will be assigned shortly.");
      setStep(3);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      console.error("Error submitting request:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
        status: error.status
      });

      // Handle specific error cases
      if (error.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate('/login');
      } else if (error.status === 403) {
        toast.error("You don't have permission to create requests.");
        navigate('/dashboard');
      } else if (error.status === 400) {
        // Handle validation errors
        const errorData = error.response?.data;
        if (errorData?.errors) {
          // Display each validation error
          errorData.errors.forEach((err: { field: string; message: string }) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else if (errorData?.message) {
          toast.error(errorData.message);
        } else {
          toast.error("Invalid request data. Please check your input.");
        }
      } else if (error.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.message || "Failed to submit request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getSelectedService = () => {
    return serviceTypes.find(service => service.id === selectedService);
  };

  // The handleUseCurrentLocation function is no longer needed as LocationPicker handles this

  return (
    <div className="w-full mx-auto">
      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">What do you need help with?</h2>
            <p className="text-muted-foreground">Select the service you require</p>
          </div>

          <RadioGroup value={selectedService || ""} onValueChange={setSelectedService} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serviceTypes.map((service) => (
              <div key={service.id} className="flex">
                <RadioGroupItem
                  value={service.id}
                  id={service.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={service.id}
                  className="flex flex-1 items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
                      {service.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="font-medium">${service.price}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedService}
          >
            Continue
          </Button>
        </form>
      )}

      {step === 2 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitUserInfo)} className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Your Information</h2>
              <p className="text-muted-foreground">Please provide your details so we can help you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        readOnly={!!userProfile}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                        readOnly={!!userProfile}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label>Your Location</Label>
                <LocationPicker
                  onLocationSelect={(loc) => {
                    setLocation(loc);
                    form.setValue('address', loc.address);
                    form.setValue('latitude', loc.latitude);
                    form.setValue('longitude', loc.longitude);

                    // Pass location to parent component if callback is provided
                    if (onLocationSelect) {
                      onLocationSelect(loc);
                    }
                  }}
                  initialLocation={location || undefined}
                />
                {form.formState.errors.address && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="vehicle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Information</FormLabel>
                    <FormControl>
                      <Input placeholder="Make, model, color (e.g., Honda Civic, Blue)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific details that might help the responder"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2 bg-secondary/50 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Service Fee:</span>
                <span>${getSelectedService()?.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${getSelectedService()?.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  "Request Help"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {step === 3 && (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Car size={32} className="text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Help is on the way!</h2>
            <p className="text-muted-foreground">We're finding you the closest available assistant.</p>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Your requested service:</div>
            <div className="font-medium">{getSelectedService()?.name}</div>
            <div className="text-primary">${getSelectedService()?.price.toFixed(2)}</div>
          </div>

          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary origin-left animate-[loader_2s_ease-in-out_infinite]" style={{ width: '30%' }}></div>
          </div>

          <p className="text-sm text-muted-foreground">Please keep this page open to see when an assistant accepts.</p>
        </div>
      )}
    </div>
  );
};

export default RequestForm;
