interface User {
    //id: string;
    username: string;
    password: string;
    isActive: boolean;
  }
  
  interface Business {
    //maruti nandan and ganesh
    //pedhi
    displayName: string;
    isActive: boolean;
  }
  
  interface Customer {
    //vepari
    diplayName: string;
  }
  
  interface Payments {
    customerName: string; //Customer.displayName
    customerId: string; //Customer.id
    paymentDate: string;
    jodi: number;
    noOfBox: number;
    rate: number;
    amount: number; //(jodi * noOfBox * rate),
    createdBy: string;
    updatedBy: string;
    createdDate: string;
    updatedDate: string;
  }
  