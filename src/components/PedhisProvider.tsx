import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPedhis } from '../store/pedhisSlice';

interface PedhisProviderProps {
  children: React.ReactNode;
}

const PedhisProvider: React.FC<PedhisProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.pedhis);

  useEffect(() => {
    // Fetch pedhis on component mount
    dispatch(fetchPedhis());
  }, [dispatch]);

  // Optional: Log the state for debugging
  useEffect(() => {
    if (data.length > 0) {
      console.log('Pedhis loaded:', data);
    }
    if (error) {
      console.error('Error loading pedhis:', error);
    }
  }, [data, error]);

  return <>{children}</>;
};

export default PedhisProvider; 