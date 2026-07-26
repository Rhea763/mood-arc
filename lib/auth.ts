import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getAuthSecret, isMockMode, MOCK_ACCESS_TOKEN, readEnv } from "@/lib/config";
import {
  accessTokenStillValid,
  expiresAtFromExpiresIn,
  refreshGoogleAccessToken,
} from "@/lib/google-token-refresh";

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

  const clientId = readEnv("GOOGLE_CLIENT_ID");
  const clientSecret = readEnv("GOOGLE_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
    console.warn(
      "[auth] Google OAuth not configured; using mock provider so deploy can succeed."
    );
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
        token.error = undefined;
        return token;
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = expiresAtFromExpiresIn(account.expires_in);
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
        }
        token.error = undefined;
      }

      if (user?.id) {
        token.sub = user.id;
      }

      const expiresAt =
        typeof token.accessTokenExpires === "number"
          ? token.accessTokenExpires
          : undefined;

      if (
        typeof token.accessToken === "string" &&
        accessTokenStillValid(expiresAt)
      ) {
        return token;
      }

      if (typeof token.refreshToken === "string") {
        try {
          const refreshed = await refreshGoogleAccessToken(token.refreshToken);
          token.accessToken = refreshed.accessToken;
          token.accessTokenExpires = refreshed.accessTokenExpires;
          if (refreshed.refreshToken) {
            token.refreshToken = refreshed.refreshToken;
          }
          token.error = undefined;
        } catch (err) {
          console.error("[auth] Google refresh_token failed:", err);
          token.error = "RefreshAccessTokenError";
          token.accessToken = undefined;
        }
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
      if (token.error === "RefreshAccessTokenError") {
        session.error = "RefreshAccessTokenError";
      }
      return session;
    },
  },
});

export async function requireAccessToken(): Promise<string | null> {
  const session = await auth();
  if (session?.error === "RefreshAccessTokenError") {
    return null;
  }
  return session?.accessToken ?? null;
}
