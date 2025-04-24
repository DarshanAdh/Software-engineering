import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle, CheckCircle2, LogOut } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PendingApproval = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900 to-blue-800">
      <Navbar />

      <div className="flex-1 container max-w-md mx-auto px-4 pt-32 pb-16">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Account Pending Approval</CardTitle>
            <CardDescription className="text-blue-200">
              Your helper account is awaiting administrator approval
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4 text-white">
              <p>
                Hello <span className="font-semibold">{user?.fullName}</span>,
              </p>
              <p>
                Thank you for registering as a helper with Roadside Assistance. Your account is currently under review by our administrators.
              </p>
              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30 flex items-start mt-6">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-200">
                  You'll receive an email notification once your account has been approved. This process typically takes 24-48 hours.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
              <h3 className="text-blue-300 font-medium flex items-center mb-2">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                What happens next?
              </h3>
              <ul className="text-sm text-blue-200 list-disc pl-5 space-y-1">
                <li>Our team will review your application</li>
                <li>You may be contacted for additional information</li>
                <li>Once approved, you'll have full access to the helper dashboard</li>
                <li>You can start accepting roadside assistance requests</li>
              </ul>
            </div>
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PendingApproval;
