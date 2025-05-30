import { AuthService } from '@/features/auth/services/auth-services';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { ImpersonateResponse, SignInOauthResponse } from '@/features/auth/types/auth-service-types';
import * as Sentry from '@sentry/nextjs';

// Assuming environment variables are used for sensitive information
const clientId = '1039974389462-g6s4vg1eu0cnr5g9mb0p4ffnmkv8ffvh.apps.googleusercontent.com';
const clientSecret = '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';

// Define interfaces for better type checking and readability
interface SignInResponse {
  session_token: string;
  user_id: string;
  name: string;
  email: string;
  image_url: string;
  is_onboarded: boolean;
  experiment_group?: string;
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user, account, trigger, session }) => {
      const customToken: JWT = token;
      if (trigger === 'update' && session?.is_onboarded) {
        customToken.is_onboarded = session?.is_onboarded;
      }
      if (trigger === 'signIn' && user.impersonated) {
        customToken.id = user.id;
        customToken.name = user.name;
        customToken.email = user.email;
        customToken.image = user.image;
        customToken.sessionToken = user.sessionToken;
        customToken.impersonated = user.impersonated;
        customToken.is_onboarded = user.is_onboarded;
        customToken.experiment_group = user.experiment_group;
      } else if (trigger === 'signIn' || trigger === 'signUp') {
        try {
          const res: SignInOauthResponse = await AuthService.signInOauth({
            provider: account!.provider as string,
            email: user.email as string,
            name: user.name as string,
            native_id_token: user.id as string,
            image_url: user.image as string,
          });
          customToken.sessionToken = res.session_token;
          customToken.id = res.user_id;
          customToken.name = res.name;
          customToken.email = res.email;
          customToken.image = res.image_url;
          customToken.is_onboarded = res.is_onboarded;
          customToken.experiment_group = res.experiment_group;
        } catch (error) {
          console.error('Error in signInOauth callback:', error);
          Sentry.captureException(error);
          // Handle the error appropriately
        }
      }

      return customToken;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.sessionToken = token.sessionToken;
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.is_onboarded = token.is_onboarded;
        session.user.impersonated = token.impersonated;
        session.user.experiment_group = token.experiment_group;
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
    CredentialsProvider({
      name: 'Impersonate',
      credentials: {
        user_id: { label: 'User ID to impersonate', type: 'text' },
        login_secret: { label: 'Login Secret', type: 'text' },
      },
      authorize: async credentials => {
        try {
          const res: ImpersonateResponse = await AuthService.impersonate({
            user_id: credentials?.user_id as string,
            login_secret: credentials?.login_secret as string,
          });
          return {
            id: res.user_id,
            name: res.name,
            sessionToken: res.session_token,
            email: res.email,
            image: res.image_url,
            is_onboarded: true,
            impersonated: true,
          };
        } catch (error) {
          console.error('Error in impersonate callback:', error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: 'tester',
      name: 'Tester Login',
      credentials: {
        login_secret: { label: 'Login Secret', type: 'text' },
        subscription_status: { label: 'Subscribed User', type: 'checkbox' },
      },
      authorize: async credentials => {
        try {
          const res = await AuthService.testerLogin({
            login_secret: credentials?.login_secret as string,
            subscription_status: credentials?.subscription_status == 'true',
          });

          return {
            id: res.user_id,
            name: res.name,
            sessionToken: res.session_token,
            email: res.email,
            image: res.image_url,
            is_onboarded: true,
            impersonated: true,
          };
        } catch (error) {
          console.error('Error in tester login callback:', error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    strategy: 'jwt',
  },
};
