import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCustomers } from '../store/customersSlice';

interface CustomersProviderProps {
  children: React.ReactNode;
}

const CustomersProvider: React.FC<CustomersProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.customers);

  useEffect(() => {
    // Fetch customers on component mount
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Optional: Log the state for debugging
  useEffect(() => {
    if (data.length > 0) {
      console.log('Customers loaded:', data);
    }
    if (error) {
      console.error('Error loading customers:', error);
    }
  }, [data, error]);

  return <>{children}</>;
};

export default CustomersProvider; 