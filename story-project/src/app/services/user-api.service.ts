import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; 
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  
 private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getUserId(): Observable<string> {
    return this.http.get(`${this.baseUrl}/api/user/me`, { responseType: 'text' }); 
}

   getUserById(userId : string): Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/api/user/${userId}`);
   }

 

}
