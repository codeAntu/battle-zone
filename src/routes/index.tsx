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
    <div className='bg-red-500 p-2'>
      <h3>Welcome Home!</h3>

      <button onClick={handleClick}>Click me</button>
      <button onClick={sendtoken}>Send token</button>
    </div>
  );
}
