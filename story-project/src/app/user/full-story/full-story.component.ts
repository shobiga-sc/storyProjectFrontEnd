import { Component } from '@angular/core';
import { Story } from '../../models/story.model';
import { ActivatedRoute } from '@angular/router';
import { StoryApiService } from '../../services/story-api.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-full-story',
  standalone: true,
  imports: [],
  templateUrl: './full-story.component.html',
  styleUrl: './full-story.component.css'
})
export class FullStoryComponent {

   storyId: string = '';
     story?: Story;
     isStoryVisible = false;
     userId = localStorage.getItem('userId') as string;
     isSaved = false;
     isLiked = false;
     likeCount: number = 0;
     viewCount: number = 0;


  
  
  
  
     constructor(
      private route: ActivatedRoute,
      private storyApiService: StoryApiService
     ){}
  
     ngOnInit(){
      this.storyId = this.route.snapshot.paramMap.get('id') || '';

 
  
      this.storyApiService.getStoryById(this.storyId).subscribe(
        (data: Story) => {
          this.story = data;
          this.likeCount = data.likeCount ?? 0;
          this.viewCount = data.viewCount ?? 0;
          this.trackStoryRead();

        }
        
      );

  

    
        this.checkIfSaved();
        this.checkIfLiked();
      
     
     }

     trackStoryRead(): void {
      if (sessionStorage.getItem(`read_${this.storyId}`)) {
        console.log('Read tracking already triggered for this session.');
        return;
      }
      console.log("opened");
  
      if (!this.story) return;

      this.storyApiService.trackStoryRead(
        this.userId,
        this.story.authorId ?? '', 
        this.storyId, 
        this.story.paid ?? false   
      ).subscribe(
        (msg) => console.log('Story Read Tracked, Updated View Count:', msg),
        (error) => console.error('Error tracking story read:', error)
      );
      
    }

     checkIfSaved() {
      this.storyApiService.isStorySaved(this.userId, this.storyId).subscribe(response => {
        this.isSaved = response;
      }, error => {
        console.error('Error checking saved status', error);
      });
    }

    checkIfLiked() {
      this.storyApiService.isStoryLiked(this.userId, this.storyId).subscribe(response => {
        this.isLiked = response;
      }, error => {
        console.error('Error checking liked status', error);
      });
    }
  
    toggleLikeStory() {
      if (this.isLiked) {
        this.storyApiService.unlikeStory(this.userId, this.storyId).subscribe(() => {
          this.isLiked = false;
          this.likeCount = Math.max(0, this.likeCount - 1);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Like Removed",
            showConfirmButton: false,
            timer: 1500
          });
        }, error => {
          console.error('Error unliking story', error);
        });
      } else {
        this.storyApiService.likeStory(this.userId, this.storyId).subscribe(() => {
          this.isLiked = true;
          this.likeCount += 1;
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Story Liked",
            showConfirmButton: false,
            timer: 1500
          });
        }, error => {
          console.error('Error liking story', error);
        });
      }
    }
    toggleSaveStory() {
      if (this.isSaved) {
        this.storyApiService.unsaveStory(this.userId, this.storyId).subscribe(
          () => {
            this.isSaved = false;
            Swal.fire({
              icon: 'success',
              title: 'Story Unsaved',
              text: 'This story has been removed from your saved list.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error => {
            console.error('Error unsaving story', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to unsave the story. Please try again.',
            });
          }
        );
      } else {
        this.storyApiService.saveStory(this.userId, this.storyId).subscribe(
          () => {
            this.isSaved = true;
            Swal.fire({
              icon: 'success',
              title: 'Story Saved',
              text: 'This story has been added to your saved list.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error => {
            console.error('Error saving story', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to save the story. Please try again.',
            });
          }
        );
      }
    }
}
