import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { signOut } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';

// PROD:  put admins directly in the DB and make a get request for array of admins at account scope;

// DEV:  array of verified email addresses
const admin_email_addresses = [
  'johnsasser20@gmail.com',
  'cw.john.sasser@gmail.com',
];

export const auth_config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      // session.accessToken = token.accessToken;
      // session.user.id = token.id;
      if (admin_email_addresses.includes(session?.user?.email)) {
        return session;
      } else return signOut();
    },
  },
};

export async function adminValidation(req, res) {
  const session = await getServerSession(req, res, auth_config);

  if (!admin_email_addresses.includes(session?.user?.email)) {
    res.status(401);
    res.end();
  }
}

export default NextAuth(auth_config);
