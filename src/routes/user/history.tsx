import { getHistory, History as HistoryType } from '@/api/transaction';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

// Import Shadcn UI components
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';

export const Route = createFileRoute('/user/history')({
  component: History,
});

export function History() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userHistory'],
    queryFn: getHistory,
  });

  if (isLoading)
    return (
      <div className='container mx-auto p-4'>
        <Card className='border-border/40 bg-background'>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-16 w-full' />
              <Skeleton className='h-16 w-full' />
              <Skeleton className='h-16 w-full' />
            </div>
          </CardContent>
        </Card>
      </div>
    );

  if (error)
    return (
      <div className='container mx-auto p-4'>
        <Card className='border-border/40 bg-background text-destructive'>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>Error loading transaction history</CardContent>
        </Card>
      </div>
    );

  if (!data || !data.data.history || data.data.history.length === 0) {
    return (
      <div className='container mx-auto p-4'>
        <Card className='border-border/40 bg-background'>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>No transaction history found</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <Card className='border-border/40 bg-background'>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.history.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: HistoryType }) {
  // Format date using utility function
  const formattedDate = formatDateToUTC(
    transaction.createdAt instanceof Date ? transaction.createdAt.toISOString() : transaction.createdAt,
  );
  const formattedTime = formatTimeToUTC(
    transaction.createdAt instanceof Date ? transaction.createdAt.toISOString() : transaction.createdAt,
  );

  // Determine style for status badge
  const getStatusVariant = () => {
    switch (transaction.status.toLowerCase()) {
      case 'completed':
      case 'approved':
        return 'default';
      case 'pending':
        return 'outline';
      case 'rejected':
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = () => {
    switch (transaction.transactionType.toLowerCase()) {
      case 'deposit':
        return '↓';
      case 'withdrawal':
        return '↑';
      case 'bonus':
        return '🎁';
      case 'winnings':
        return '🏆';
      default:
        return '•';
    }
  };

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(transaction.amount);

  const isIncrease = transaction.balanceEffect === 'increase';
  const isDecrease = transaction.balanceEffect === 'decrease';

  return (
    <TableRow className='border-border/40'>
      <TableCell className='text-muted-foreground'>
        {formattedDate} {formattedTime}
      </TableCell>
      <TableCell>
        <div className='flex items-center'>
          <span className='mr-2 text-xl'>{getTypeIcon()}</span>
          <span className='font-medium capitalize'>{transaction.transactionType}</span>
        </div>
      </TableCell>
      <TableCell className={isIncrease ? 'text-green-500' : isDecrease ? 'text-red-500' : 'text-muted-foreground'}>
        {isIncrease ? '+' : isDecrease ? '-' : ''} {formattedAmount}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusVariant()}>{transaction.status}</Badge>
      </TableCell>
      <TableCell className='text-muted-foreground'>
        {transaction.message || `Ref: #${transaction.referenceId}`}
      </TableCell>
    </TableRow>
  );
}
