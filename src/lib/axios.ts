import axios, { AxiosResponse, AxiosError } from 'axios';
import { API } from './API';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import toast from 'react-hot-toast';
import { redirectToExpiryPage } from '@/features/auth/actions/redirect-to-logout';
import * as Sentry from '@sentry/nextjs';

declare module 'axios' {
  export interface AxiosInstance {
    getSessionToken: () => string;
  }
}

function isSessionInvalid(err: AxiosError<{ detail: string }>) {
  return err.response?.status === 401 || err.response?.status === 403;
}

const ApiClient = () => {
  const instance = axios.create({
    baseURL: API,
  });

  let lastSession: Session | null = null;

  async function fetchSession() {
    if (lastSession == null) {
      const session = await getSession();
      lastSession = session;
    }
  }

  instance.interceptors.request.use(
    async request => {
      //set refer to the current page

      if (typeof window !== 'undefined' && window.location) {
        request.headers['request-location'] = window.location.href;
      }
      await fetchSession();
      if (lastSession && lastSession.user) {
        request.headers['x-access-token'] = `${lastSession.user.sessionToken}`;
      } else {
        request.headers['x-access-token'] = undefined;
      }
      return request;
    },
    (error: AxiosError) => {
      console.error(`API Error: `, error);
      throw error;
    },
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },

    (err: AxiosError<{ detail: string }>) => {
      console.log('Error detected: ', err);
      if (isSessionInvalid(err)) {
        Sentry.captureException(err);
        console.log('Session expired');
        redirectToExpiryPage();
      }
      throw err;
    },
  );

  instance.getSessionToken = () => {
    fetchSession();
    return lastSession ? lastSession.user.sessionToken : 'undefined';
  };

  return instance;
};

const axiosClient = ApiClient();

export default axiosClient;
