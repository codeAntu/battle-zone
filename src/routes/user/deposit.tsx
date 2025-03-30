import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/deposit')({
  component: RouteComponent,
})
const withdrawInstructions = [
  '1. Open the app and go to the wallet section.',
  '2. Select the withdraw option.',
  '3. Enter the amount you want to withdraw.',
  '4. Choose your preferred withdrawal method (bank transfer, PayPal, etc.).',
  '5. Confirm the transaction and wait for processing.',
];


function RouteComponent() {
  return (
    <div className='mx-auto max-w-[800px] space-y-5 p-5'>
      <div>
        <p className='text-2xl font-bold'>Withdraw Funds</p>
      </div>
      <div>
        <img src='./' alt='qr' className='m-auto aspect-square w-full max-w-72 border bg-white' />
      </div>
      <div>
        <div>How to withdraw ?</div>
        <div>
          <ul className='list-disc pl-5'>
            {withdrawInstructions.map((instruction, index) => (
              <li key={index} className='text-sm text-gray-200'>
                {instruction}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
