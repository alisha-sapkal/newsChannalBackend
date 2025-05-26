import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from '../../../../db'; // Adjust the path accordingly

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      const existingUser = await db('users').where({ email: user.email }).first();

      if (!existingUser) {
        await db('users').insert({
          email: user.email,
          name: user.name,
          image: user.image,
          provider: account?.provider,
          provider_id: account?.providerAccountId,
          role: 'subscriber', // Default role
          created_at: new Date(),
          updated_at: new Date(),
          last_login: new Date(),
          is_active: true,
        });
      } else {
        await db('users').where({ email: user.email }).update({
          last_login: new Date(),
          updated_at: new Date(),
        });
      }

      return true;
    },

    async session({ session, token }) {
      // Extend session object with user role and id
      const userFromDB = await db('users').where({ email: session.user.email }).first();
      if (userFromDB) {
        session.user.id = userFromDB.id;
        session.user.role = userFromDB.role;
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt', // Use JWT strategy for session management
  },

  pages: {
    signIn: '/auth/signin', // Your custom sign-in page
    error: '/auth/error',   // Error page
  },
};

export default NextAuth(authOptions);
