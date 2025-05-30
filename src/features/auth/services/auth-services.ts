import { SuccessfulResponse } from '@/types/api-types';
import {
  AuthServiceLogInOauthPost,
  SignInOauthResponse,
  ImpersonateResponse,
  LogoutResponse,
  AuthServiceImpersonatePost,
} from '../types/auth-service-types';
import axiosClient from '@/lib/axios';
import { AxiosResponse } from 'axios';
import { API } from '@/lib/API';
interface TesterLoginRequest {
  login_secret: string;
  subscription_status: boolean;
}

interface TesterResetRequest {
  login_secret: string;
  user_id: string;
}

interface TesterLoginResponse {
  session_token: string;
  user_id: string;
  name: string;
  email: string;
  image_url: string;
}

interface TesterResetResponse {
  success: boolean;
}

export const AuthService = {
  signInOauth: async (val: AuthServiceLogInOauthPost): Promise<SignInOauthResponse> => {
    const response: AxiosResponse<SignInOauthResponse> = await axiosClient.post<SignInOauthResponse>(
      `${API}/user/login/oauth2`,
      JSON.stringify({ ...val, is_web: true }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  },

  impersonate: async ({ user_id, login_secret }: AuthServiceImpersonatePost): Promise<ImpersonateResponse> => {
    const response: AxiosResponse<ImpersonateResponse> = await axiosClient.post<ImpersonateResponse>(
      `${API}/user/impersonate`,
      JSON.stringify({ user_id, login_secret }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.get<SuccessfulResponse<LogoutResponse>>(`${API}/user/logout`);
    return response.data;
  },

  testerLogin: async (request: TesterLoginRequest): Promise<TesterLoginResponse> => {
    const response: AxiosResponse<TesterLoginResponse> = await axiosClient.post<TesterLoginResponse>(
      `${API}/tester/login`,
      JSON.stringify({ ...request, user_id: 'e2e@quizard.ai' }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  },

  testerReset: async (request: TesterResetRequest): Promise<TesterResetResponse> => {
    const response: AxiosResponse<TesterResetResponse> = await axiosClient.post<TesterResetResponse>(
      `${API}/tester/reset`,
      JSON.stringify(request),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  },
};
