import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getAuthSecret, isMockMode, MOCK_ACCESS_TOKEN } from "@/lib/config";

function buildProviders(): Provider[] {
  if (isMockMode()) {
    return [
      Credentials({
        id: "mock",
        name: "Mock Demo",
        credentials: {},
        authorize: async () => ({
          id: "demo-user",
          name: "演示用户",
          email: "demo@moodarc.local",
        }),
      }),
    ];
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required when MOODARC_MOCK=false"
    );
  }

  return [
    Google({
      clientId,
      clientSecret,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/youtube",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ];
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: getAuthSecret(),
  session: { strategy: "jwt" },
  providers: buildProviders(),
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "mock") {
        token.accessToken = MOCK_ACCESS_TOKEN;
      } else if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export async function requireAccessToken(): Promise<string | null> {
  const session = await auth();
  return session?.accessToken ?? null;
}
