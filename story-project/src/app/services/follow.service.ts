import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private baseUrl = environment.baseUrl;
  private followedAuthors = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {}

  followAuthor(authorId: string, userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/follow/${authorId}?userId=${userId}`, {});
  }

  unfollowAuthor(authorId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/follow/${authorId}?userId=${userId}`);
  }

  loadFollowedAuthors(userId: string): void {
    this.http.get<string[]>(`${this.baseUrl}/api/follow/${userId}/following`).subscribe(authors => {
      this.followedAuthors.next(authors);
    });
  }

  getFollowedAuthors(): Observable<string[]> {
    return this.followedAuthors.asObservable();
  }

  isFollowing(authorId: string, userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/api/follow/${userId}/isFollowing/${authorId}`);
  }

  getFollowCount(userId: string): Observable<{ followingCount: number; followersCount: number }> {
    return this.http.get<{ followingCount: number; followersCount: number }>(`${this.baseUrl}/api/follow/${userId}/count`);
  }
}
