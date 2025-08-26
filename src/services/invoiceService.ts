import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import type { InvoiceData } from '../store/invoiceSlice';
import { convertFirebaseArray, convertFirebaseData } from '../utils/firebaseUtils';

export interface FirebaseInvoiceData extends InvoiceData {
  id?: string;
  grandTotal?: number;
  createdAt?: string;
  updatedAt?: string;
  amount?: number;
}

export interface InvoiceCounter {
  lastNumber: number;
}

export const invoiceService = {
  // Get current month-year in YYYY-MM format
  getCurrentMonthYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  },

  // Get or create invoice counter for specific customer and month
  async getInvoiceCounter(customerName: string): Promise<number> {
    try {
      const monthYear = this.getCurrentMonthYear();
      const counterRef = doc(db, 'invoice_counters', `${monthYear}-${customerName}`);
      const counterDoc = await getDoc(counterRef);

      if (counterDoc.exists()) {
        const data = counterDoc.data() as InvoiceCounter;
        return data.lastNumber;
      } else {
        // Return 0 for new customer-month combinations (no invoices yet)
        return 0;
      }
    } catch (error) {
      console.error('Error getting invoice counter:', error);
      throw error;
    }
  },

  // Increment invoice counter for specific customer and month
  async incrementInvoiceCounter(customerName: string): Promise<void> {
    try {
      const monthYear = this.getCurrentMonthYear();
      const counterRef = doc(db, 'invoice_counters', `${monthYear}-${customerName}`);
      const counterDoc = await getDoc(counterRef);

      if (counterDoc.exists()) {
        const data = counterDoc.data() as InvoiceCounter;
        await updateDoc(counterRef, {
          lastNumber: data.lastNumber + 1
        });
      } else {
        // Create new counter for current customer-month with lastNumber: 1
        const newCounter: InvoiceCounter = { lastNumber: 1 };
        await setDoc(counterRef, newCounter);
      }
    } catch (error) {
      console.error('Error incrementing invoice counter:', error);
      throw error;
    }
  },

  // Generate next invoice number for specific customer
  async generateNextInvoiceNumber(customerName: string): Promise<string> {
    try {
      const currentNumber = await this.getInvoiceCounter(customerName);
      // For the first invoice, we want to return 1, not currentNumber + 1
      // The currentNumber represents the last used number, so the next should be currentNumber + 1
      // But if currentNumber is 0 (no invoices yet), we want 1
      const nextNumber = currentNumber === 0 ? 1 : currentNumber + 1;
      return nextNumber.toString();
    } catch (error) {
      console.error('Error generating invoice number:', error);
      throw error;
    }
  },

  // Save invoice to Firebase
  async saveInvoice(invoiceData: InvoiceData, incrementCounter: boolean = true): Promise<string> {
    try {
      // Calculate grand total
      // const grandTotal = invoiceData.items.reduce((total, item) => total + item.amount, 0);
      console.log('grandTotal-->', invoiceData)
      const invoiceWithTimestamps: FirebaseInvoiceData = {
        ...invoiceData,
        amount: invoiceData.grandTotal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('invoiceWithTimestamps-->', invoiceWithTimestamps)
      const docRef = await addDoc(collection(db, 'invoices'), invoiceWithTimestamps);
      
      // Only increment the invoice counter if specified (for auto-generated invoices)
      if (incrementCounter) {
        await this.incrementInvoiceCounter(invoiceData.customer);
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving invoice:', error);
      throw error;
    }
  },

  // Get all invoices (excluding soft deleted ones)
  async getAllInvoices(): Promise<FirebaseInvoiceData[]> {
    try {
      const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const invoices: FirebaseInvoiceData[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter out soft deleted invoices
        if (!data.isDeleted) {
          invoices.push({
            id: doc.id,
            ...data
          } as FirebaseInvoiceData);
        }
      });
      
      // Convert Firebase Timestamps to serializable Date objects
      return convertFirebaseArray(invoices);
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw error;
    }
  },

  // Get invoice by ID (excluding soft deleted ones)
  async getInvoiceById(id: string): Promise<FirebaseInvoiceData | null> {
    try {
      const docRef = doc(db, 'invoices', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Check if invoice is soft deleted
        if (data.isDeleted) {
          return null; // Return null for soft deleted invoices
        }
        const invoice = {
          id: docSnap.id,
          ...data
        } as FirebaseInvoiceData;
        
        // Convert Firebase Timestamps to serializable Date objects
        return convertFirebaseData(invoice);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting invoice:', error);
      throw error;
    }
  },

  // Update invoice
  async updateInvoice(id: string, invoiceData: Partial<InvoiceData>): Promise<void> {
    try {
      const docRef = doc(db, 'invoices', id);
      await updateDoc(docRef, {
        ...invoiceData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Soft delete invoice
  async softDeleteInvoice(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'invoices', id);
      await updateDoc(docRef, {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error soft deleting invoice:', error);
      throw error;
    }
  },

  // Hard delete invoice (keeping for reference)
  async deleteInvoice(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'invoices', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
}; 