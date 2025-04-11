import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS } from '@/config/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, User, Users, History, DollarSign, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  userType: 'customer' | 'helper' | 'admin';
  isApproved?: boolean;
  createdAt: string;
  phone: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  userId: string;
  userName: string;
  userType: string;
  description: string;
}

interface RequestHistory {
  id: string;
  status: string;
  location: string;
  serviceType: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  helperId?: string;
  helperName?: string;
}

const AdminDashboard = () => {
  const { user, approveHelper, deleteUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending-helpers');
  const [pendingHelpers, setPendingHelpers] = useState<UserData[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userHistory, setUserHistory] = useState<RequestHistory[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch pending helpers
  const fetchPendingHelpers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.admin.getPendingHelpers, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingHelpers(data.helpers);
      } else {
        toast.error('Failed to fetch pending helpers');
      }
    } catch (error) {
      console.error('Error fetching pending helpers:', error);
      toast.error('An error occurred while fetching pending helpers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.admin.getAllUsers, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllUsers(data.users);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.admin.getTransactions, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      } else {
        toast.error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('An error occurred while fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user history
  const fetchUserHistory = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.admin.getUserHistory(userId), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserHistory(data.history);
        setSelectedUserId(userId);
      } else {
        toast.error('Failed to fetch user history');
      }
    } catch (error) {
      console.error('Error fetching user history:', error);
      toast.error('An error occurred while fetching user history');
    } finally {
      setLoading(false);
    }
  };

  // Handle helper approval
  const handleApproveHelper = async (helperId: string) => {
    const success = await approveHelper(helperId);
    if (success) {
      // Refresh the pending helpers list
      fetchPendingHelpers();
      // Refresh all users list
      fetchAllUsers();
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const success = await deleteUser(userId);
      if (success) {
        // Refresh the users list
        fetchAllUsers();
        // If we were viewing this user's history, clear it
        if (selectedUserId === userId) {
          setUserHistory([]);
          setSelectedUserId(null);
        }
      }
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'pending-helpers') {
      fetchPendingHelpers();
    } else if (activeTab === 'all-users') {
      fetchAllUsers();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">
            Manage users, approve helpers, and monitor transactions
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Admin Control Panel</CardTitle>
            <CardDescription className="text-gray-400">
              {user?.fullName} - Super Admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="pending-helpers" className="data-[state=active]:bg-blue-600">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Pending Helpers
                </TabsTrigger>
                <TabsTrigger value="all-users" className="data-[state=active]:bg-blue-600">
                  <Users className="mr-2 h-4 w-4" />
                  All Users
                </TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-600">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Transactions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending-helpers">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Pending Helper Approvals</CardTitle>
                    <CardDescription className="text-gray-400">
                      Review and approve helper applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        <p className="mt-4 text-gray-400">Loading pending helpers...</p>
                      </div>
                    ) : pendingHelpers.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No pending helper applications</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-700">
                              <TableHead className="text-gray-400">Name</TableHead>
                              <TableHead className="text-gray-400">Email</TableHead>
                              <TableHead className="text-gray-400">Phone</TableHead>
                              <TableHead className="text-gray-400">Registered</TableHead>
                              <TableHead className="text-gray-400">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingHelpers.map((helper) => (
                              <TableRow key={helper.id} className="border-gray-700">
                                <TableCell className="font-medium text-white">{helper.fullName}</TableCell>
                                <TableCell className="text-gray-300">{helper.email}</TableCell>
                                <TableCell className="text-gray-300">{helper.phone}</TableCell>
                                <TableCell className="text-gray-300">{formatDate(helper.createdAt)}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm" 
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleApproveHelper(helper.id)}
                                    >
                                      <CheckCircle className="mr-1 h-4 w-4" />
                                      Approve
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      onClick={() => handleDeleteUser(helper.id)}
                                    >
                                      <XCircle className="mr-1 h-4 w-4" />
                                      Reject
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => fetchUserHistory(helper.id)}
                                    >
                                      <History className="mr-1 h-4 w-4" />
                                      History
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all-users">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">All Users</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage all users in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        <p className="mt-4 text-gray-400">Loading users...</p>
                      </div>
                    ) : allUsers.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No users found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-700">
                              <TableHead className="text-gray-400">Name</TableHead>
                              <TableHead className="text-gray-400">Email</TableHead>
                              <TableHead className="text-gray-400">Type</TableHead>
                              <TableHead className="text-gray-400">Status</TableHead>
                              <TableHead className="text-gray-400">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {allUsers.map((user) => (
                              <TableRow key={user.id} className="border-gray-700">
                                <TableCell className="font-medium text-white">{user.fullName}</TableCell>
                                <TableCell className="text-gray-300">{user.email}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    user.userType === 'admin' 
                                      ? 'bg-purple-600' 
                                      : user.userType === 'helper' 
                                        ? 'bg-blue-600' 
                                        : 'bg-green-600'
                                  }>
                                    {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {user.userType === 'helper' && (
                                    <Badge className={user.isApproved ? 'bg-green-600' : 'bg-yellow-600'}>
                                      {user.isApproved ? 'Approved' : 'Pending'}
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {user.userType === 'helper' && !user.isApproved && (
                                      <Button 
                                        size="sm" 
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleApproveHelper(user.id)}
                                      >
                                        <CheckCircle className="mr-1 h-4 w-4" />
                                        Approve
                                      </Button>
                                    )}
                                    {user.userType !== 'admin' && (
                                      <Button 
                                        size="sm" 
                                        variant="destructive"
                                        onClick={() => handleDeleteUser(user.id)}
                                      >
                                        <XCircle className="mr-1 h-4 w-4" />
                                        Delete
                                      </Button>
                                    )}
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => fetchUserHistory(user.id)}
                                    >
                                      <History className="mr-1 h-4 w-4" />
                                      History
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Transactions</CardTitle>
                    <CardDescription className="text-gray-400">
                      Monitor all financial transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        <p className="mt-4 text-gray-400">Loading transactions...</p>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No transactions found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-700">
                              <TableHead className="text-gray-400">ID</TableHead>
                              <TableHead className="text-gray-400">User</TableHead>
                              <TableHead className="text-gray-400">Amount</TableHead>
                              <TableHead className="text-gray-400">Status</TableHead>
                              <TableHead className="text-gray-400">Description</TableHead>
                              <TableHead className="text-gray-400">Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transactions.map((transaction) => (
                              <TableRow key={transaction.id} className="border-gray-700">
                                <TableCell className="font-medium text-white">{transaction.id.substring(0, 8)}</TableCell>
                                <TableCell className="text-gray-300">{transaction.userName}</TableCell>
                                <TableCell className={transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                                  ${Math.abs(transaction.amount).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <Badge className={
                                    transaction.status === 'completed' 
                                      ? 'bg-green-600' 
                                      : transaction.status === 'pending' 
                                        ? 'bg-yellow-600' 
                                        : 'bg-red-600'
                                  }>
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-gray-300">{transaction.description}</TableCell>
                                <TableCell className="text-gray-300">{formatDate(transaction.createdAt)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* User History Section */}
            {selectedUserId && (
              <Card className="bg-gray-900 border-gray-700 mt-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">User History</CardTitle>
                    <CardDescription className="text-gray-400">
                      Viewing history for user {allUsers.find(u => u.id === selectedUserId)?.fullName || pendingHelpers.find(h => h.id === selectedUserId)?.fullName}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setUserHistory([]);
                      setSelectedUserId(null);
                    }}
                  >
                    Close
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                      <p className="mt-4 text-gray-400">Loading user history...</p>
                    </div>
                  ) : userHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No history found for this user</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead className="text-gray-400">Request ID</TableHead>
                            <TableHead className="text-gray-400">Service Type</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Customer</TableHead>
                            <TableHead className="text-gray-400">Helper</TableHead>
                            <TableHead className="text-gray-400">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userHistory.map((request) => (
                            <TableRow key={request.id} className="border-gray-700">
                              <TableCell className="font-medium text-white">{request.id.substring(0, 8)}</TableCell>
                              <TableCell className="text-gray-300">{request.serviceType}</TableCell>
                              <TableCell>
                                <Badge className={
                                  request.status === 'completed' 
                                    ? 'bg-green-600' 
                                    : request.status === 'in_progress' 
                                      ? 'bg-blue-600' 
                                      : request.status === 'cancelled' 
                                        ? 'bg-red-600'
                                        : 'bg-yellow-600'
                                }>
                                  {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-300">{request.customerName}</TableCell>
                              <TableCell className="text-gray-300">{request.helperName || 'N/A'}</TableCell>
                              <TableCell className="text-gray-300">{formatDate(request.createdAt)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
