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
        const newCounts = responses.map(response => {
          const data = response.data;

          // Check if data is an array or if it contains an array under a key
          if (Array.isArray(data)) {
              return data.length;
          } else if (typeof data === 'object' && data !== null) {
              // Find the first key with an array value
              const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
              return arrayKey ? data[arrayKey].length : 0;
          } else {
              return 0; // Fallback if neither an array nor object with array was found

          }
        });
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
