import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from './models/story.model'; 

@Injectable({
  providedIn: 'root'
})
export class StoryApiService {

  private apiUrl = 'http://localhost:8080/api/story';
  constructor(private http: HttpClient) { }

 postStory(story: Story): Observable<Story> {
  
    return this.http.post<Story>(`${this.apiUrl}/create`, story); 
}
}
