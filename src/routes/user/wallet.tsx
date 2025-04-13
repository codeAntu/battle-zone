import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Deposit } from './deposit';
import { History } from './history';
import { Withdraw } from './withdraw';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/user/wallet')({
  component: WalletPage,
});

function WalletPage() {
  const [activeTab, setActiveTab] = useState('deposit');
  const pages = ['Deposit', 'Withdraw', 'History'];

  return (
    <>
      <div className='space-y-3 border px-5 pt-2'>
        <div className='text-2xl font-semibold'>Wallet</div>
        <div className='w-full'>
          <div className='mb-4 flex gap-2'>
            {pages.map((page) => (
              <Button
                key={page}
                variant={activeTab === page.toLowerCase() ? 'default' : 'outline'}
                onClick={() => setActiveTab(page.toLowerCase())}
                className='flex-1'
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div>
        {activeTab === 'deposit' && <Deposit />}
        {activeTab === 'withdraw' && <Withdraw />}
        {activeTab === 'history' && <History />}
      </div>
    </>
  );
}
