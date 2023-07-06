import type { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

export const authOptions: AuthOptions = {
  providers: [
    {
      id: "Bitkubnext",
      name: "Bitkubnext",
      type: "oauth",
      authorization: "https://accounts.bitkubnext.com/oauth2/authorize",
      token: "https://accounts.bitkubnext.com/oauth2/access_token",
      userinfo: "https://api.bitkubnext.io/accounts/auth/info",
      clientId: "6459fd1885750c15cd208bdf",
      profile(profile) {
        console.log(profile);
        return {
          id: "1",
          name: "no",
          wallet: "",
        };
      },
    },
  ],
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    signIn(data) {
      //async if you can
      console.log(data);
      return true;
    },
    redirect({ url, baseUrl }) {
      console.log("url", url);
      console.log("baseUrl", baseUrl);
      return baseUrl;
    },
    session({ session, token, user }) {
      return session;
    },
    jwt(data) {
      console.log(data);
      if (data.account?.access_token) {
        data.token.accessToken = data.account.access_token;
      }
      return data.token;
    },
  },
};

export default NextAuth(authOptions);
