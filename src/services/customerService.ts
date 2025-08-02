import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export interface Customer {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Add a new customer to the customers collection
export const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const customersCollection = collection(db, 'customers');
    const newCustomer = {
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(customersCollection, newCustomer);
    return docRef.id;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw new Error('Failed to add customer');
  }
};

// Get all customers from the customers collection
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const customersCollection = collection(db, 'customers');
    const q = query(customersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const customers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Customer[];
    
    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Failed to fetch customers');
  }
}; 