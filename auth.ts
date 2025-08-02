import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

interface User {
    username?: string;
    email?: string;
    name?: string;
    image?: string;
}


interface session {
  accessToken?: string;
  expires?: string;
  user?: {
    username?: string;
    email?: string;
    name?: string;
    image?: string;
  };
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || 'your-auth-secret-key-at-least-32-chars-long',
  providers: [GitHub({
    clientId: process.env.AUTH_GITHUB_ID || '',
    clientSecret: process.env.AUTH_GITHUB_SECRET || '',
    authorization: {
      params: {
        scope: "read:user user:email repo admin:repo_hook write:issues write:pull_requests read:pull_requests"
      }
    }
  })],
  callbacks: {
    async session({ session, token }) {
      ((session).accessToken as session) = token.accessToken as session;
      ((session.user).username as User) = token.username as User;
      ((session.user as any).email as User) = token.email as User;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "github") {
        token.accessToken = account.access_token;
        token.username = profile?.login;
        token.email = profile?.email;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to /signup after successful authentication
      if (url === baseUrl+"/Login") {
        return `${baseUrl}/homepage`;
      }
      return url;
    }
  }
});