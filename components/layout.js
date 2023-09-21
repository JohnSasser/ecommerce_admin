import { useSession, signIn, signOut } from 'next-auth/react';
import Nav from '../components/nav';

export default function Layout({ children }) {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn('google')}
            className="bg-white p-4 rounded-lg text-black font-medium"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-1 mr-1 rounded-lg p-4 mb-2">
        {children}
        {/* Logged in with NextAuth as {session.user.email} */}
      </div>
    </div>
  );
}
