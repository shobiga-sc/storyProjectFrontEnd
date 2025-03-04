export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    roles: string[]; 
    primeSubscriber: boolean;
    primeSubscriptionExpiry: string | null; 
    followedAuthors: string[];
    signUpDate:  Date,
    freeRead: string[]
  }
  