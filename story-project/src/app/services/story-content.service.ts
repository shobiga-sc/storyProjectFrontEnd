

import { Injectable } from '@angular/core';
import { Story } from '../models/story.model'; 

@Injectable({
  providedIn: 'root'
})
export class StoryContentService {
  private storyData: Partial<Story> = {}; 

  setStoryData(data: Partial<Story>) {
    this.storyData = { ...data };
  }

  getStoryData(): Partial<Story> {
    return this.storyData;
  }
}
