import { Inter } from 'next/font/google';
import { useSession, signIn, signOut } from 'next-auth/react';
import Nav from '../components/nav';
// const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data: session } = useSession();
  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   );
  // }
  // return (
  //   <>
  //     Not signed in <br />
  //     <button onClick={() => signIn()}>Sign in</button>
  //   </>
  // );

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
    <div className="bg-blue-900 min-h-screen">
      <Nav />

      <div>Logged in with NextAuth as {session.user.email}</div>
    </div>
  );
}
