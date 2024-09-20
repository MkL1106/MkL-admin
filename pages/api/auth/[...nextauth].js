import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { Admin } from '@/models/Admin'; // Assuming Admin model is already set up
import { mongooseConnect } from '@/lib/mongoose';

// Function to fetch admin emails from the database
export async function fetchAdminEmails() {
  try {
    await mongooseConnect(); 
    const admins = await Admin.find({}, 'mail'); // Fetch only the 'mail' field
    return admins.map(admin => admin.mail); // Return an array of emails
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    return [];
  }
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async (session, token, user) => {
      const adminEmails = await fetchAdminEmails();
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const adminEmails = await fetchAdminEmails();
  if (!adminEmails.includes(session?.user?.email)) {
    throw 'Not an admin';
  }
}
