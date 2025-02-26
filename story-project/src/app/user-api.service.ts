import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private apiUrl = 'http://localhost:8080/api/user';
  constructor(private http: HttpClient) { }

  getUserId(): Observable<string> {
    return this.http.get(`${this.apiUrl}/me`, { responseType: 'text' }); 
}

   getUserById(userId : string): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
   }

}
