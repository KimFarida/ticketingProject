import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { AxiosError } from 'axios';

interface UseCountsReturn {
  counts: number[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const useCounts = (apiEndpoints: string[]): UseCountsReturn => {
  const [counts, setCounts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = async (signal: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const responses = await Promise.all(
        apiEndpoints.map(endpoint =>
          api.get(endpoint, {
            signal,
            params: { _t: Date.now() } // Cache busting
          })
        )
      );

      const newCounts = responses.map(response => {
        const data = response.data;

        // Handle array response
        if (Array.isArray(data)) {
          return data.length;
        }

        // Handle object response with array
        if (typeof data === 'object' && data !== null) {
          const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
          return arrayKey ? data[arrayKey].length : 0;
        }

        return 0;
      });

      setCounts(newCounts);
      setError(null);
    } catch (error: unknown) {
      // Ignore aborted requests
      if (error instanceof Error && error.name === 'AbortError') return;

      // Handle Axios errors
      if (error instanceof AxiosError) {
        console.error('API Error:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Failed to fetch data');
        return;
      }

      // Handle other errors
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching counts:', errorMessage);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchCounts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [JSON.stringify(apiEndpoints)]); // Stable dependency array

  const refresh = () => {
    const controller = new AbortController();
    fetchCounts(controller.signal);

    return () => {
      controller.abort();
    };
  };

  return { counts, loading, error, refresh };
};

export default useCounts;
