import { useSession, signIn, signOut } from 'next-auth/react';
import Nav from '../components/nav';
import Logo from './logo';
import { useState } from 'react';

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="bg-gray-200 w-screen h-screen flex items-center">
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

  function navToggle() {
    if (showNav === false) setShowNav(true);
    else setShowNav(false);
  }

  console.log(showNav);
  return (
    <div className="bg-gray-200 h-full">
      <div className=" md:hidden flex pl-6 items-center ">
        <button onClick={() => navToggle()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-14 py-4">
          <Logo />
        </div>
      </div>
      <div className="bg-gray-200 flex">
        <Nav showNav={showNav} />
        <div className="bg-white flex-grow mt-4 mb-4 rounded-l-lg p-4">
          {children}
          {/* Logged in with NextAuth as {session.user.email} */}
        </div>
      </div>
    </div>
  );
}
