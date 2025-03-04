import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }


  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/signin`, credentials);
  }


  signup(userData: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/auth/signup`, userData);
  }


  saveToken(token: string, role: string) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role); 
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}
