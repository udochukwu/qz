export interface SubscriptionCancelFormData {
  cancelReason: string;
  feedback: string;
}

export interface SubscriptionStatusResponse {
  is_pro: boolean;
  limits: SubscriptionStatusLimit;
  usage: SubscriptionStatusUsage;
}

export interface Subscription {
  currency: string;
  per_month_price: number;
  saving_rate: number;
  term: string;
  total_price: number;
  trial_days: number;
}
export interface SubscriptionListResponse {
  subscriptions: Subscription[];
  eligible_for_trial: boolean;
}

export interface SubscriptionManageResponse {
  redirect_url: string;
}

export enum SubscriptionTerm {
  Monthly = 'monthly',
  Yearly = 'yearly',
}
export interface SubscriptionSubscribeRequest {
  subscription_term: SubscriptionTerm;
}

export interface SubscriptionSubscribeRequestWithDiscount {
  discount_id: string;
  user_id: string;
}

export interface SubscriptionSubscribeResponse {
  success: boolean;
  checkout_page_url: string;
}

export interface StatusLimit {
  limit: number | null;
  period: string | null;
  period_cadence: number | null;
}

export interface SubscriptionStatusLimit {
  document: StatusLimit;
  message: StatusLimit;
  recording: StatusLimit;
  youtube: StatusLimit;
}

export interface SubscriptionStatusUsage {
  document: number;
  message: number;
  recording: number;
  youtube: number;
}
