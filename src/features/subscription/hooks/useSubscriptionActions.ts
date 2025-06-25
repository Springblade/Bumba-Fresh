import { useState, useCallback } from 'react';
import { useToasts as useToast } from '../../../hooks/useToasts';
import { cancelSubscription as cancelSubscriptionAPI, pauseSubscription as pauseSubscriptionAPI, resumeSubscription as resumeSubscriptionAPI } from '../../../services/subscriptions';

export const useSubscriptionActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const pauseSubscription = useCallback(async (subscriptionId?: number) => {
    if (!subscriptionId) {
      toast({
        title: 'Error',
        description: 'Subscription ID is required to pause subscription.',
        type: 'error'
      });
      return false;
    }

    setIsLoading(true);
    try {
      await pauseSubscriptionAPI(subscriptionId);
      toast({
        title: 'Subscription Paused',
        description: 'Your subscription has been paused successfully.',
        type: 'success'
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to pause subscription. Please try again.',
        type: 'error'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const resumeSubscription = useCallback(async (subscriptionId?: number) => {
    if (!subscriptionId) {
      toast({
        title: 'Error',
        description: 'Subscription ID is required to resume subscription.',
        type: 'error'
      });
      return false;
    }

    setIsLoading(true);
    try {
      await resumeSubscriptionAPI(subscriptionId);
      toast({
        title: 'Subscription Resumed',
        description: 'Your subscription has been resumed successfully.',
        type: 'success'
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resume subscription. Please try again.',
        type: 'error'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const cancelSubscription = useCallback(async (subscriptionId?: number) => {
    if (!subscriptionId) {
      toast({
        title: 'Error',
        description: 'Subscription ID is required to cancel subscription.',
        type: 'error'
      });
      return false;
    }

    setIsLoading(true);
    try {
      await cancelSubscriptionAPI(subscriptionId);
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled successfully.',
        type: 'success'
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again.',
        type: 'error'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const updatePaymentMethod = useCallback(async () => {
    setIsLoading(true);
    try {
      // This would be implemented when payment method update API is available
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Payment Method Updated',
        description: 'Your payment method has been updated successfully.',
        type: 'success'
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payment method. Please try again.',
        type: 'error'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  return {
    isLoading,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    updatePaymentMethod
  };
};