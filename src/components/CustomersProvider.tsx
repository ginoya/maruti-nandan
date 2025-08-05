import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCustomers } from '../store/customersSlice';

interface CustomersProviderProps {
  children: React.ReactNode;
}

const CustomersProvider: React.FC<CustomersProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch customers on component mount
    dispatch(fetchCustomers());
  }, [dispatch]);



  return <>{children}</>;
};

export default CustomersProvider; 