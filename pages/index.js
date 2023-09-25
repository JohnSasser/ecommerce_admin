import { data } from 'autoprefixer';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';

export default function Home() {
  const { data: session } = useSession();
  console.log('session: ', session);

  const name = session?.user?.name;
  const user_image = session?.user?.image;
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          {' '}
          <b>Hello, {name}.</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden p-1.5">
          <img src={user_image} alt="headshot" className="w-6 h-6 rounded-lg" />
          <span className="px-2">{name}</span>
        </div>
      </div>
    </Layout>
  );
}
