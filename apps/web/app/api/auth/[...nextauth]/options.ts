import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt(data) {
      // 如果是首次登录，将 userId 添加到 token 中
      if (data.user && data.account && data.profile) {
        console.log('User signin in via Githu:',data)
        // token.userId = user.id || "generated-user-id"; // 替换为你自己的逻辑生成 userId
        try {
          const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: data.account.provider,
              providerAccountId: data.account.providerAccountId,
              email: data.profile.email || data.user.email, // Use email from profile or user object
              name: data.profile.name || data.user.name,
              image: data.profile.image || data.user.image,
              loginTime: new Date().toISOString(),
            }),
          });

          if (backendResponse.ok) {
            const backendData = await backendResponse.json();
            data.token.idToken = backendData.idToken;
            data.token.userId = backendData.userId;
          } else {
            console.error('Backend user creation/lookup failed:', backendResponse.statusText);
          }
        } catch (error) {
          console.error('Error during backend sync:', error);
        }
      }
      return data.token;
    },
    async session(data) {
      if(data.token.idToken){
        //@ts-ignore
        data.session.user.idToken = data.token.idToken;
      }
      if (data.token.userId) {
        //@ts-ignore
        data.session.user.userId = data.token.userId;
      }
      return data.session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
