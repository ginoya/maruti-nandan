import { useAppSelector } from '../store/hooks';

export const useCustomers = () => {
  const { data: customers, loading, error } = useAppSelector((state) => state.customers);
  
  return {
    customers,
    loading,
    error,
    isEmpty: customers.length === 0,
  };
}; 