import Games from '@/components/games';
import { getApi, postApi } from '@/services';
import API from '@/services/api';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  async function handleClick() {
    const data = await postApi(API.hello);
    console.log(data);
  }

  // send token in header

  async function sendtoken() {
    const data = await axios.post(API.hello);
    console.log(data.data);
  }

  return (
    <div className='p-5'>
      <Games />
    </div>
  );
}
