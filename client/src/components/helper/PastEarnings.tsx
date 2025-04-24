import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { API_ENDPOINTS } from '@/config/api';
import { toast } from 'sonner';

interface PastRequest {
  _id: string;
  serviceType: string;
  status: string;
  estimatedPrice: number;
  createdAt: string;
  completedAt?: string;
  location: {
    address: string;
  };
  user: {
    fullName: string;
  };
  transaction?: {
    amount: number;
    helperEarnings: number;
    serviceFee: number;
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const PastEarnings = () => {
  const [pastRequests, setPastRequests] = useState<PastRequest[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchPastRequests = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(
        `${API_ENDPOINTS.helper.myHistory}?page=${page}&limit=${pagination.limit}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch past requests');
      }

      const data = await response.json();
      setPastRequests(data.requests);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching past requests:', error);
      toast.error('Failed to load past requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastRequests();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchPastRequests(newPage);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { text: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { text: 'Pending', variant: 'outline' },
      accepted: { text: 'Accepted', variant: 'secondary' },
      inProgress: { text: 'In Progress', variant: 'default' },
      completed: { text: 'Completed', variant: 'default' },
      cancelled: { text: 'Cancelled', variant: 'destructive' }
    };

    const config = statusConfig[status] || { text: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  // Calculate total earnings from displayed transactions
  const calculateTotalEarnings = () => {
    return pastRequests
      .filter(req => req.status === 'completed')
      .reduce((total, req) => {
        const earnings = req.transaction?.helperEarnings || (req.estimatedPrice * 0.85);
        return total + earnings;
      }, 0);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-blue-800">Past Request Earnings</CardTitle>
            <CardDescription className="text-blue-700">
              Your completed service requests and earnings
            </CardDescription>
          </div>
          {pastRequests.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Displayed Earnings</p>
              <p className="text-xl font-bold text-accent">${calculateTotalEarnings().toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : pastRequests.length === 0 ? (
          <div className="text-center py-8 text-blue-700">
            No past requests found. Complete service requests to earn money.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Your Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="font-medium">
                        {formatDate(request.completedAt || request.createdAt)}
                      </TableCell>
                      <TableCell>{request.user?.fullName || 'Unknown'}</TableCell>
                      <TableCell>{request.serviceType}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {request.location?.address || 'Unknown location'}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">${request.estimatedPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium text-accent">
                        {request.status === 'completed'
                          ? `$${(request.transaction?.helperEarnings || request.estimatedPrice * 0.85).toFixed(2)}`
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="py-2 px-3 text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PastEarnings;
