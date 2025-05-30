export interface AuthServiceLogInOauthPost {
  provider: string;
  email: string;
  name: string;
  provider_user_id?: string;
  image_url: string;
  provider_token?: string;
  native_id_token?: string;
}

// Updated to match the Python code for signInOauth response
export interface SignInOauthResponse {
  user_id: string;
  session_token: string;
  new_user: boolean;
  name: string;
  email: string;
  image_url: string;
  experiments?: { [key: string]: any };
  is_onboarded: boolean;
  experiment_group?: string;
}

export interface AuthServiceImpersonatePost {
  user_id: string;
  login_secret: string;
}

export interface ImpersonateResponse {
  user_id: string;
  session_token: string;
  new_user: boolean;
  name: string;
  email: string;
  image_url: string;
}

// Updated to match the Python code for logout response
export interface LogoutResponse {
  success: boolean; // The success status of the request
}
