import { fetchData } from './api';

export interface CreateSubscriptionRequest {
  subscriptionPlan: 'basic' | 'premium' | 'signature';
  timeExpired: string; // ISO date string
}

export interface SubscriptionResponse {
  message: string;
  subscription: {
    plan_id: number;
    user_id: number;
    subscription_plan: string;
    time_expired: string;
    created_at: string;
  };
  subscriptionNumber: string;
}

/**
 * Create a new subscription
 * @param data Subscription data
 * @returns Promise with subscription response
 */
export const createSubscription = async (data: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
  // Remove the /api prefix since API_URL already includes it
  return fetchData<SubscriptionResponse>('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};


