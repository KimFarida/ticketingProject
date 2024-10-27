import { useEffect, useState } from 'react';
import api from '../api/axios';

const useCounts = (apiEndpoints: string[]) => {
  const [counts, setCounts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const responses = await Promise.all(apiEndpoints.map(endpoint => api.get(endpoint)));
        const newCounts = responses.map(response => response.data.length); // Get length of each response
        setCounts(newCounts);
      } catch (err) {
        setError('Error fetching counts');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [apiEndpoints]);

  return { counts, loading, error };
};

export default useCounts;
