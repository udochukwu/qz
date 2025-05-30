# Unstuck CourseGPTFrontend

# GitStart Contribution Guide

Thank you for considering contributing to our project! Your contributions are valuable to us and help improve the project. Please follow these guidelines to ensure smooth collaboration.

## Table of Contents

- Introduction
- [Getting Started](#get-started)
  - Prerequisites
  - Installation
  - [Running the Project](#running-the-project)
- [Libraries Used](#libraries-used)
- [Project Structure](#project-structure)
- Testing

## Introduction

This project is a Next.js web app designed to help students in their studies.

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js >= 20.11.1
- pnpm >= 9.8.0



### Get Started

1. Clone the repository

### Configuration

2. Run and complete the configuration in the `.env` file:

```sh
cp .env.example .env
```

If you are using M1 then run this in terminal:

```sh
brew install pkg-config cairo pango
```

### Installation

3. Install dependencies:

```sh
pnpm install
```

### Running the Project with Visual Studio

4. To start the project in development mode, run:

```sh
pnpm dev
```

Than Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note: For clearing cache delete `node_modules` folder and delete `pnpm-lock.yaml` then run again `pnpm install` command for fresh fetching of dependencies. 
Alternatively commands can be used `rm -rf node_modules pnpm-lock.yaml && pnpm install`


## Libraries Used

- **Next.js**: A framework for building web apps.
- **PandaCSS**: A library for styling components.
- **react-i18next**: A library for localisation the web app.
- **react-voice-visualizer**: A highly customizable solution for capturing, visualizing, and manipulating audio recordings.
- **ESLint**: A tool for identifying and fixing linting issues in your JavaScript code.

## Project Structure

The project follows a standard React Native structure with a focus on separating business logic from view logic. Here is an overview of the project structure:

- **src/components/**: Contains global reusable components.
- **src/hooks/**: Custom hooks for managing state and side effects.
- **src/app/**: Screen components like pages and APIs.
- **src/features/**: Contains components related to specific features.
- **src/locales/**: Contains language translation files.
- **utils/**: Utility functions and constants.


### Signing-in to the dev environment 

To sign in to the app replace the content of file `src/lib/auth-auth.ts` with following content:

<details>
<summary>See Here</summary>

  ```typescript
// src/lib/auth-auth.ts
import { AuthService } from '@/features/auth/services/auth-services';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { ImpersonateResponse, SignInOauthResponse } from '@/features/auth/types/auth-service-types';
import * as Sentry from '@sentry/nextjs';
import AppleProvider from 'next-auth/providers/apple';
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
            email: user.email || '',
            name: user.name || '',
            provider_user_id: user.id as string,
            image_url: user.image as string,
            provider_token: account?.id_token as string,
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
    AppleProvider({
      clientId: `com.unstuckstudy.web`,
      clientSecret: `eyJhbGciOiJFUzI1NiIsImtpZCI6Ik5BR0I1MlZXUkoifQ.eyJpc3MiOiIyWktFS0wzNEozIiwiaWF0IjoxNzMyMTMwNDA3LjYxNCwiZXhwIjoxNzQ3NjgyNDA4LCJhdWQiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwic3ViIjoiY29tLnVuc3R1Y2tzdHVkeS53ZWIifQ.QIv43PYHUdwGR4t0PTRCjJkBTucPohVM_z26zgrYQF4DAMiUsra4yCmsUpTAhhKG1nZjx2NUJMiF3X6YKJt_hg`,
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
  ],
  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        // secure: process.env.NODE_ENV === 'production',
        secure: false,
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    strategy: 'jwt',
  },
};
```

</details>


### Testing

Before pushing code make sure that following commands are passing:

- **Run Build**:

  ```sh
  pnpm build
  ```

### Important Notes

Before asking for review and QA please make sure following things.

1. Run `pnpm build` and it should pass build.
2. Check for localisation, every text should be localised.
3. Cross browser testing, must be tested on different browsers specially Safari and Chrome.
4. Clean code, remove unused imports, packages and code.
5. A loom video of your work and description must be added.

### Trouble shooting

Incase you run into difficulties starting the project

1. Make sure you have the required environment variables.
2. Delete `node_modules`, `pnpm-lock.lock`. alternatively these commands can be used `rm -rf node_modules pnpm-lock.yaml && pnpm install`
3. Go through the installation steps.

