import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { convertFirebaseArray, convertFirebaseData } from '../utils/firebaseUtils';

export interface PaymentData {
  customerId: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirebasePaymentData extends PaymentData {
  id?: string;
}

export const paymentService = {
  // Save payment to Firebase
  async savePayment(paymentData: PaymentData): Promise<string> {
    try {
      const paymentWithTimestamps: FirebasePaymentData = {
        ...paymentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'payments'), paymentWithTimestamps);
      return docRef.id;
    } catch (error) {
      console.error('Error saving payment:', error);
      throw error;
    }
  },

  // Get all payments (excluding soft deleted ones)
  async getAllPayments(): Promise<FirebasePaymentData[]> {
    try {
      const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const payments: FirebasePaymentData[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter out soft deleted payments
        if (!data.isDeleted) {
          payments.push({
            id: doc.id,
            ...data
          } as FirebasePaymentData);
        }
      });
      
      // Convert Firebase Timestamps to serializable Date objects
      return convertFirebaseArray(payments);
    } catch (error) {
      console.error('Error getting payments:', error);
      throw error;
    }
  },

  // Get payment by ID (excluding soft deleted ones)
  async getPaymentById(id: string): Promise<FirebasePaymentData | null> {
    try {
      const docRef = doc(db, 'payments', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Check if payment is soft deleted
        if (data.isDeleted) {
          return null; // Return null for soft deleted payments
        }
        const payment = {
          id: docSnap.id,
          ...data
        } as FirebasePaymentData;
        
        // Convert Firebase Timestamps to serializable Date objects
        return convertFirebaseData(payment);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  },

  // Update payment
  async updatePayment(id: string, paymentData: Partial<PaymentData>): Promise<void> {
    try {
      const docRef = doc(db, 'payments', id);
      await updateDoc(docRef, {
        ...paymentData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  },

  // Soft delete payment
  async softDeletePayment(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'payments', id);
      await updateDoc(docRef, {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error soft deleting payment:', error);
      throw error;
    }
  },

  // Hard delete payment (keeping for reference)
  async deletePayment(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'payments', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }
}; 