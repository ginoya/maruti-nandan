import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { InvoiceData } from '../store/invoiceSlice';

export interface FirebaseInvoiceData extends InvoiceData {
  id?: string;
  grandTotal?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const invoiceService = {
  // Save invoice to Firebase
  async saveInvoice(invoiceData: InvoiceData): Promise<string> {
    try {
      // Calculate grand total
      const grandTotal = invoiceData.items.reduce((total, item) => total + item.amount, 0);
      
      const invoiceWithTimestamps: FirebaseInvoiceData = {
        ...invoiceData,
        grandTotal,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'invoices'), invoiceWithTimestamps);
      console.log('Invoice saved successfully with ID:', docRef.id);
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
      
      return invoices;
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
        return {
          id: docSnap.id,
          ...data
        } as FirebaseInvoiceData;
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
        updatedAt: new Date()
      });
      console.log('Invoice updated successfully');
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
        deletedAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Invoice soft deleted successfully');
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
      console.log('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
}; 