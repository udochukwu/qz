import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    sessionToken: string;
    name: string;
    email: string;
    image: string;
    error?: string;
    is_onboarded: boolean;
    experiments?: { [key: string]: any };
    impersonated?: boolean;
    experiment_group?: string;
  }

  interface Session {
    user: {
      id: string;
      sessionToken: string;
      name: string;
      email: string;
      image: string;
      is_onboarded: boolean;
      experiments?: { [key: string]: any };
      impersonated?: boolean;
      experiment_group?: string;
    } & DefaultSession;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    sessionToken: string;
    name: string;
    email: string;
    image: string;
    error?: string;
    is_onboarded: boolean;
    experiments?: { [key: string]: any };
    impersonated?: boolean;
    experiment_group?: string;
  }
}
