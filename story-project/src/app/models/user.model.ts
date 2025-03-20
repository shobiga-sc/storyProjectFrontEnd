export interface User {
    id: string;
    username: string;
    email: string;
    roles: string[]; 
    primeSubscriber: boolean;
    primeSubscriptionExpiry: string | null; 
    signUpDate:  Date,
    freeRead: string[]
  }
  