import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface PaymentData {
  customerId: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
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
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'payments'), paymentWithTimestamps);
      console.log('Payment saved successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving payment:', error);
      throw error;
    }
  },

  // Get all payments
  async getAllPayments(): Promise<FirebasePaymentData[]> {
    try {
      const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const payments: FirebasePaymentData[] = [];
      
      querySnapshot.forEach((doc) => {
        payments.push({
          id: doc.id,
          ...doc.data()
        } as FirebasePaymentData);
      });
      
      return payments;
    } catch (error) {
      console.error('Error getting payments:', error);
      throw error;
    }
  },

  // Get payment by ID
  async getPaymentById(id: string): Promise<FirebasePaymentData | null> {
    try {
      const docRef = doc(db, 'payments', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as FirebasePaymentData;
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
        updatedAt: new Date()
      });
      console.log('Payment updated successfully');
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  },

  // Delete payment
  async deletePayment(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'payments', id);
      await deleteDoc(docRef);
      console.log('Payment deleted successfully');
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }
}; 