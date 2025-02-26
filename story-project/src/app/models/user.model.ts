export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    roles: string[]; 
    isPrimeSubscriber: boolean;
    primeSubscriptionExpiry: string | null; 
    followedAuthors: string[];
  }
  