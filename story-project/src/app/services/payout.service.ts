import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payout } from '../models/payout.model'; 
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PayoutService {
  private baseUrl = environment.baseUrl; 

  constructor(private http: HttpClient) {}

  
  processPayout(payoutData: Payout): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/payouts/process`, payoutData);
  }

  checkPayoutStatus(writerId: string, month: number, year: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/api/payouts/status?writerId=${writerId}&month=${month}&year=${year}`);
  }
}
