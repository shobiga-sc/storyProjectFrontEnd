import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  private BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createOrder(userId: string) {
    return this.http.post(`${this.BASE_URL}/api/payment/create-order/${userId}`, {});
  }

  verifyPayment(paymentData: any) {
    return this.http.post(`${this.BASE_URL}/api/payment/verify`, paymentData); 
  }
}
