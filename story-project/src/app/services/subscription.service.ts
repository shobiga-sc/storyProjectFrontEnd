import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getSubscriptionAmount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/admin/subscription/amount`);
  }

  updateSubscriptionAmount(amount: number): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/api/admin/subscription/amount`, { amount });
  }
}
