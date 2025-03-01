import { Component } from '@angular/core';
import { StoryApiService } from '../../services/story-api.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Story } from '../../models/story.model'; // Ensure you have a Story model
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-saved-stories',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './saved-stories.component.html',
  styleUrl: './saved-stories.component.css'
})
export class SavedStoriesComponent {
  savedStoriesList: any[] = [];
  savedStories: Story[] = [];
  userId = localStorage.getItem('userId');

  constructor(private storyApiService: StoryApiService) {}

  ngOnInit(): void {
    const userId = this.userId ?? ''; 

    this.storyApiService.getSavedStories(userId).subscribe((data) => {
      this.savedStoriesList = data;

      const storyRequests = this.savedStoriesList.map(story => 
        this.storyApiService.getStoryById(story.storyId)
      );

      forkJoin(storyRequests).subscribe(stories => {
        this.savedStories = stories;
      });
    });
  }
}
