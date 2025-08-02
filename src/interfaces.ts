// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Payments {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}
  