
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Request from "./pages/Request";
import Helper from "./pages/Helper";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HelperDashboard from "./pages/HelperDashboard";
import HowItWorks from "./pages/HowItWorks";
import { useEffect } from "react";
import ProtectedCustomerRoute from './components/auth/ProtectedCustomerRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Configure the query client with better defaults for reliability
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 0, // Consider all data stale immediately
      gcTime: 1000 * 60 * 5,
    },
  },
});

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />

    {/* Protected Customer Routes */}
    <Route element={<ProtectedCustomerRoute />}>
      <Route path="/request" element={<Request />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>

    {/* Protected Helper Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/helper-dashboard" element={<HelperDashboard />} />
    </Route>

    {/* Public Routes */}
    <Route path="/helper" element={<Helper />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/how-it-works" element={<HowItWorks />} />

    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  useEffect(() => {
    document.title = "Roadside Relief | Fast & Trustworthy Roadside Assistance";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" closeButton richColors />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
