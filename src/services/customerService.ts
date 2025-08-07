import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { convertFirebaseArray } from '../utils/firebaseUtils';

export interface Customer {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

// Add a new customer to the customers collection
export const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const customersCollection = collection(db, 'customers');
    const newCustomer = {
      ...customerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false
    };
    
    const docRef = await addDoc(customersCollection, newCustomer);
    return docRef.id;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw new Error('Failed to add customer');
  }
};

// Get all non-deleted customers from the customers collection
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const customersCollection = collection(db, 'customers');
    
    // Query for customers where isDeleted is false OR isDeleted doesn't exist (for existing customers)
    const q = query(
      customersCollection, 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const customers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Customer[];
    
    // Filter out deleted customers on the client side
    const nonDeletedCustomers = customers.filter(customer => 
      customer.isDeleted !== true
    );
    
    // Convert Firebase Timestamps to serializable Date objects
    return convertFirebaseArray(nonDeletedCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Failed to fetch customers');
  }
};

// Soft delete a customer
export const softDeleteCustomer = async (customerId: string): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', customerId);
    await updateDoc(customerRef, {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error soft deleting customer:', error);
    throw new Error('Failed to delete customer');
  }
}; 