import { useAppSelector } from '../store/hooks';

export const usePedhis = () => {
  const { data: pedhis, loading, error } = useAppSelector((state) => state.pedhis);
  
  return {
    pedhis,
    loading,
    error,
    isEmpty: pedhis.length === 0,
  };
}; 