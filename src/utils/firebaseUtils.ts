import { Timestamp } from 'firebase/firestore';

// Convert Firebase Timestamp to ISO string (serializable)
export const convertTimestampToString = (timestamp: Timestamp | Date | any): string | null => {
  if (!timestamp) return null;
  
  // If it's already a Date object, convert to ISO string
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  
  // If it's a Firebase Timestamp, convert it to Date then to ISO string
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  
  // If it's a timestamp object with seconds and nanoseconds
  if (timestamp && typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  
  return null;
};

// Convert an object with Firebase Timestamps to serializable format
export const convertFirebaseData = <T extends Record<string, any>>(data: T): T => {
  const converted = { ...data } as any;
  
  // Convert createdAt and updatedAt if they exist
  if ('createdAt' in converted && converted.createdAt) {
    converted.createdAt = convertTimestampToString(converted.createdAt);
  }
  
  if ('updatedAt' in converted && converted.updatedAt) {
    converted.updatedAt = convertTimestampToString(converted.updatedAt);
  }
  
  return converted as T;
};

// Convert an array of objects with Firebase Timestamps
export const convertFirebaseArray = <T extends Record<string, any>>(array: T[]): T[] => {
  return array.map(item => convertFirebaseData(item));
}; 