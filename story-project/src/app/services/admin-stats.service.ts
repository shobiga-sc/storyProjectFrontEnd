import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpParams } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class AdminStatsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTotalReads(month: number, year: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/admin/stats/total-reads?month=${month}&year=${year}`);
  }

  getPaidReads(month: number, year: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/admin/stats/reads/paid-reads?month=${month}&year=${year}`);
  }

  getUnpaidReads(month: number, year: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/admin/stats/reads/unpaid-reads?month=${month}&year=${year}`);
  }

  getTotalRevenue(month: number, year: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/admin/stats/total-revenue?month=${month}&year=${year}`);
  }

  getWriterEarnings(month: number, year: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/admin/stats/writers-earnings`, {
      params: { month: month.toString(), year: year.toString() },
    });
  }

  // getYearlyReadsStats(year: number): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/api/reads/stats/${year.toString()}`);
  // }

  getTotalReadsPerAuthor(month: number, year: number): Observable<any[]> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());

    return this.http.get<any[]>(`${this.baseUrl}/api/reads/totalReadsPerAuthor`, { params });
  }
  
}
