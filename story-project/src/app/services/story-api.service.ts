import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../models/story.model';
import { environment } from '../../environments/environment.development';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class StoryApiService {

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  postStory(story: Story): Observable<Story> {

    return this.http.post<Story>(`${this.baseUrl}/api/story/create`, story);
  }

  patchStory(storyId: string, updatedStory: Partial<Story>): Observable<Story> {
    return this.http.patch<Story>(`${this.baseUrl}/api/story/${storyId}`, updatedStory);
  }

  deleteStory(storyId: string): Observable<Story> {
    return this.http.delete<Story>(`${this.baseUrl}/api/story/${storyId}`);
  }
  getStoryByStatusAnduserId(userId: string, status: string): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.baseUrl}/api/story/${userId}/${status}`);
  }

  getStoryById(storyId: String): Observable<Story> {
    return this.http.get<Story>(`${this.baseUrl}/api/story/${storyId}`);
  }


  getAllPublishedStories(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.baseUrl}/api/story/published/all`);
  }

  isStorySaved(userId: string, storyId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/api/savedStory/isSaved/${userId}/${storyId}`);
  }

  saveStory(userId: string, storyId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/savedStory/save`, { userId, storyId });
  }

  unsaveStory(userId: string, storyId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/savedStory/delete/${userId}/${storyId}`);
  }

  getSavedStories(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/savedStory/${userId}`);
  }

  likeStory(userId: string, storyId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/likes/like`, { userId, storyId });
  }

  unlikeStory(userId: string, storyId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/likes/unlike/${userId}/${storyId}`);
  }

  isStoryLiked(userId: string, storyId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/api/likes/isLiked/${userId}/${storyId}`);
  }

  trackStoryRead(userId: string, authorId: string, storyId: string, isPaid: boolean): Observable<any> {
    const body = { userId, authorId, storyId, isPaid };
    return this.http.post(`${this.baseUrl}/api/reads/track`, body);
  }

  getAuthorMonthlyReads(authorId: string, year: number, month: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/reads/author/${authorId}/monthly/${year}/${month}`);
  }


  getTotalReads(storyId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/reads/${storyId}`);
  }


  reportStory(report: Report): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/reports/create`, report);
  }

  getAllReports(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/reports/all`);
  }

  updateReportStatus(reportId: string, status: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/reports/update/${reportId}`, { isReportAccepted: status });
  }


  getCurrentWriterEarnings(authorId: string, month: number, year: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/reads/one-writers-earnings/${authorId}`, {
      params: { month: month.toString(), year: year.toString() },
    });
  }


}
