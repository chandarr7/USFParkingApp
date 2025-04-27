import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth2";
import { apiRequest } from "@/lib/queryClient";
import { Payment } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { CreditCard, Wallet } from 'lucide-react';
import Layout from '@/components/Layout';

const PaymentHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await apiRequest('GET', `/api/payments?userId=${user.id}`);
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch payment history',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-500">Succeeded</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4 mr-2" />;
      case 'wallet':
        return <Wallet className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Payment History</CardTitle>
              <CardDescription>Please log in to view your payment history</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Payment History</CardTitle>
            <CardDescription>View all your past payments</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No payment history found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(payment.transaction_date).toLocaleDateString()}{' '}
                        <span className="text-xs text-muted-foreground">
                          ({formatDistanceToNow(new Date(payment.transaction_date), { addSuffix: true })})
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getPaymentMethodIcon(payment.payment_method)}
                          {payment.payment_method === 'credit_card' 
                            ? `Card ${payment.card_brand ? payment.card_brand : ''} ${payment.last_four ? '•••• ' + payment.last_four : ''}` 
                            : 'USF Wallet'}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                      <TableCell>
                        {payment.stripe_payment_intent_id ? (
                          <span className="text-xs text-muted-foreground">
                            ID: {payment.stripe_payment_intent_id.substring(0, 10)}...
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentHistory;