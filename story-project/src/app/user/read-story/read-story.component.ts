import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Story } from '../../models/story.model';
import { StoryApiService } from '../../services/story-api.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FollowService } from '../../services/follow.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-read-story',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './read-story.component.html',
  styleUrl: './read-story.component.css'
})
export class ReadStoryComponent {

   storyId: string = '';
   story?: Story;
   isStoryVisible = false;
   userId = localStorage.getItem('userId') as string;
   isSaved = false;
   isLiked = false;
   likeCount: number = 0;
   totalReads: number = 0;
   following: boolean = false;




   constructor(
    private route: ActivatedRoute,
    private storyApiService: StoryApiService,
    private followService: FollowService,
    private router: Router
   ){}

   ngOnInit(){
    this.storyId = this.route.snapshot.paramMap.get('id') || '';

    this.storyApiService.getStoryById(this.storyId).subscribe(
      (data: Story) => {
        this.story = data;
        this.likeCount = data.likeCount ?? 0;
        this.getTotalReads();

        if (this.story && this.story.authorId) {
          this.checkFollowingStatus(this.story.authorId, this.userId);
        }
      } 
      ,(error) => {
        console.error('Error fetching story:', error);
      }
      
    );

   
    this.checkIfSaved();
    this.checkIfLiked();
   
   }

   toggleFollow(authorId: string, userId: string): void {
    if (!authorId || !userId) return;
  
    if (!this.following) {
      this.followService.followAuthor(authorId, userId).subscribe(
        () => {
          this.following = true;
          
        },
        (error) =>   { Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to follow the author. Please try again.',
        });}
      );
    } else {
      this.followService.unfollowAuthor(authorId, userId).subscribe(
        () => {
          this.following = false;
         
        },
        (error) => { Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to unfollow the author. Please try again.',
        });}
      );
    }
  }
  
  

  checkFollowingStatus(authorId: string, userId: string) {
    this.followService.isFollowing(authorId, userId).subscribe((status: boolean) => {
      this.following = status;
    });
  }

   getTotalReads() {
    this.storyApiService.getTotalReads(this.storyId).subscribe(
      (totalReads) => {
        this.totalReads = totalReads;
  
      },
      (error) => {
        console.error('Error fetching total reads:', error);
      }
    );
  }

   showStory() {
    this.isStoryVisible = !this.isStoryVisible;
  }

   checkIfSaved() {
        this.storyApiService.isStorySaved(this.userId, this.storyId).subscribe(response => {
          this.isSaved = response;
        }, error => {
          console.error('Error checking saved status', error);
        });
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
           
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save the story. Please try again.',
              });
            }
          );
        }
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
               
                  icon: "success",
                  title: "Like Removed",
                  showConfirmButton: false,
                  timer: 1500
                });
              }, error => {
                { Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to unlike the story. Please try again.',
                });}
              });
            } else {
              this.storyApiService.likeStory(this.userId, this.storyId).subscribe(() => {
                this.isLiked = true;
                this.likeCount += 1;
                Swal.fire({
           
                  icon: "success",
                  title: "Story Liked",
                  showConfirmButton: false,
                  timer: 1500
                });
              }, error => {
                { Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to like the story. Please try again.',
                });}
              });
            }
          }


          deleteStory() {
            if (!this.storyId) {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Story ID is missing!',
              });
              return;
            }
          
            Swal.fire({
              title: 'Are you sure?',
              text: 'This action cannot be undone!',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
              if (result.isConfirmed) {
                this.storyApiService.deleteStory(this.storyId).subscribe(
                  () => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Deleted!',
                      text: 'Your story has been deleted.',
                    }).then(() => {
                      this.router.navigate(['/user/my-story']);
                    });
                  },
                  error => {
            
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops!',
                      text: 'Failed to delete the story. Please try again.',
                    });
                  }
                );
              }
            });
          }
          
          



}
