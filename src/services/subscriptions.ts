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

export interface UserSubscription {
  plan_id: number;
  plan: string;
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: string;
  nextDeliveryDate: string;
  subscriptionPlan: string;
}

export interface UserSubscriptionResponse {
  message: string;
  subscription: UserSubscription | null;
}

/**
 * Create a new subscription
 * @param data Subscription data
 * @returns Promise with subscription response
 */
export const createSubscription = async (data: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
  return fetchData<SubscriptionResponse>('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/**
 * Get user's active subscription
 * @returns Promise with user subscription data
 */
export const getUserSubscription = async (): Promise<UserSubscriptionResponse> => {
  try {
    console.log(' getUserSubscription called');
    const response = await fetchData<UserSubscriptionResponse>('/subscriptions');
    console.log(' getUserSubscription response:', response);
    return response;
  } catch (error) {
    console.error(' Error in getUserSubscription:', error);
    throw error;
  }
};

/**
 * Cancel a subscription
 * @param subscriptionId The subscription ID to cancel
 * @returns Promise with cancellation response
 */
export const cancelSubscription = async (subscriptionId: number): Promise<{ message: string; cancelledSubscription: any }> => {
  try {
    console.log(' cancelSubscription called with ID:', subscriptionId);
    const response = await fetchData<{ message: string; cancelledSubscription: any }>(`/subscriptions/${subscriptionId}`, {
      method: 'DELETE'
    });
    console.log(' cancelSubscription response:', response);
    return response;
  } catch (error) {
    console.error(' Error in cancelSubscription:', error);
    throw error;
  }
};

/**
 * Pause a subscription
 * @param subscriptionId The subscription ID to pause
 * @returns Promise with pause response
 */
export const pauseSubscription = async (subscriptionId: number): Promise<{ message: string; subscription: any }> => {
  try {
    console.log(' pauseSubscription called with ID:', subscriptionId);
    const response = await fetchData<{ message: string; subscription: any }>(`/subscriptions/${subscriptionId}/pause`, {
      method: 'PUT'
    });
    console.log(' pauseSubscription response:', response);
    return response;
  } catch (error) {
    console.error(' Error in pauseSubscription:', error);
    throw error;
  }
};

/**
 * Resume a subscription
 * @param subscriptionId The subscription ID to resume
 * @returns Promise with resume response
 */
export const resumeSubscription = async (subscriptionId: number): Promise<{ message: string; subscription: any }> => {
  try {
    console.log('▶ resumeSubscription called with ID:', subscriptionId);
    const response = await fetchData<{ message: string; subscription: any }>(`/subscriptions/${subscriptionId}/resume`, {
      method: 'PUT'
    });
    console.log(' resumeSubscription response:', response);
    return response;
  } catch (error) {
    console.error(' Error in resumeSubscription:', error);
    throw error;
  }
};


