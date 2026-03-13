import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { userService } from '../services/userService';
import { useAuth } from './useAuth';

export const useUserProfile = (userId: string) => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Only fetch if user is authenticated
      if (!isAuthenticated || !userId) {
        setData(null);
        setLoading(false);
        return;
      }

      console.log('Fetching profile for userId:', userId);
      console.log('Is authenticated:', isAuthenticated);

      try {
        setLoading(true);
        setError(null);
        const profile = await userService.getUserProfile(userId);
        setData(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, isAuthenticated]);

  const refetch = () => {
    if (userId && isAuthenticated) {
      const fetchUserProfile = async () => {
        try {
          setLoading(true);
          setError(null);
          const profile = await userService.getUserProfile(userId);
          setData(profile);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }
  };

  return { data, loading, error, refetch };
};