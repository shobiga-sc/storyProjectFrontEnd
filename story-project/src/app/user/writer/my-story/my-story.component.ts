import { Component } from '@angular/core';
import { StoryApiService } from '../../../services/story-api.service';
import { UserApiService } from '../../../services/user-api.service';
import { User } from '../../../models/user.model';
import { Story } from '../../../models/story.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-story',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-story.component.html',
  styleUrl: './my-story.component.css'
})
export class MyStoryComponent {

  user: User|null = null;
  draftStories: Story[] = [];
  publishedStories: Story[] = [];

  constructor(
  private storyApiService: StoryApiService,
  private userApiService: UserApiService,
  private location:Location,
  private router:Router
  ){

  }

  ngOnInit(){

    this.userApiService.getUserById(localStorage.getItem('userId') as string).subscribe(
      (data: User) => { 
        this.user = data;
      }
    );

    this.storyApiService.getStoryByStatusAnduserId(localStorage.getItem('userId') as string, "DRAFT").subscribe(
      (data: Story[]) => { 
        this.draftStories = data;
       
      }
    );
     
    this.storyApiService.getStoryByStatusAnduserId(localStorage.getItem('userId') as string, "PUBLISHED").subscribe(
      (data: Story[]) => { 
        this.publishedStories = data;
        
      }
    );
  }

  back(){
    this.router.navigate(['/user']);
  }



}
