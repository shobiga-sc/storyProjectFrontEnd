import { Component } from '@angular/core';
import { StoryApiService } from '../../services/story-api.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Story } from '../../models/story.model'; 
import { forkJoin } from 'rxjs';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

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
  subscriptions: Subscription[] = [];


  constructor(private storyApiService: StoryApiService, private location: Location) { }

  ngOnInit(): void {
    const userId = this.userId ?? '';

    this.subscriptions.push( this.storyApiService.getSavedStories(userId).subscribe((data) => {
      this.savedStoriesList = data;

      const storyRequests = this.savedStoriesList.map(story =>
        this.storyApiService.getStoryById(story.storyId)
      );

      this.subscriptions.push(forkJoin(storyRequests).subscribe(stories => {
        this.savedStories = stories;
      }));
    }));
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(){
    this.subscriptions.forEach(
      subscription => {
        subscription.unsubscribe();
      }
    )
  }
}
