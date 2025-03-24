import { Component } from '@angular/core';
import { Story } from '../../models/story.model';
import { ActivatedRoute } from '@angular/router';
import { StoryApiService } from '../../services/story-api.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user.model';
import { UserApiService } from '../../services/user-api.service';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from '../payment/payment.component';
import { Location } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { ToastrModule } from 'ngx-toastr';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-full-story',
  standalone: true,
  imports: [CommonModule, PaymentComponent, ToastrModule],
  templateUrl: './full-story.component.html',
  styleUrl: './full-story.component.css'
})
export class FullStoryComponent {

  storyId: string = '';
  story?: Story;
  user: User | null = null;
  isStoryVisible = false;
  userId = localStorage.getItem('userId') as string;
  isSaved = false;
  isLiked = false;
  likeCount: number = 0;
  viewCount: number = 0;
  shouldBlur: boolean = false;
  visibleContent: string = '';
  hiddenContent: string = '';
  userRole: string = localStorage.getItem('userRole') as string || '';
  data: Date = new Date();
  subscriptions: Subscription[] = [];
  


  constructor(
    private route: ActivatedRoute,
    private storyApiService: StoryApiService,
    private userApiService: UserApiService,
    private location: Location,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer
  ) {
    this.data.setMonth(this.data.getMonth() + 1);

  }


  ngOnInit() {
    this.storyId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.userId) return;

    this.subscriptions.push(this.userApiService.getUserById(this.userId).subscribe(userData => {
      this.user = userData;
      if (!this.storyId) return;


      this.subscriptions.push( this.storyApiService.getStoryByIdWithUser(this.storyId, this.userId).subscribe(response => {

        if (!response || !response.story) {
          console.error('Invalid response from API');
          return;
        }
        if (this.story && this.story.id === response.story.id) return;


        this.story = response.story;
        this.shouldBlur = response.shouldBlur;
        this.likeCount = this.story?.likeCount ?? 0;
        this.viewCount = this.story?.viewCount ?? 0;



        if (!this.shouldBlur) {
          if (localStorage.getItem('userRole') !== "ROLE_ADMIN") {
            if (this.story?.authorId !== this.userId)
              this.trackStoryRead();
          }
        }

        if (this.shouldBlur && localStorage.getItem('userRole') !== "ROLE_ADMIN") {
          this.notificationService.showNotification('You have used all 3 free reads. Subscribe to access more stories.');

          const words = this.story?.content?.split(' ') || [];
          this.visibleContent = words.slice(0, 25).join(' ') + '...';
          this.hiddenContent = "There was Alex, the lone soldier who lived with the old lady. It was unclear whether they were related. On Friday afternoons Alex was always out on the balcony in boxer shorts and an undershirt, cleaning his short barrel M-16 in the sun, smoking and sweating for an hour or two, and I would watch him from our balcony and say, what a waste of manpower."


        } else {

          if (localStorage.getItem('userRole') !== "ROLE_ADMIN" && this.story?.paid && !this.user?.primeSubscriber) {
            if (this.story?.authorId !== this.userId) {
              this.notificationService.showNotification('This is one of your free read stories. Subscribe to read more prime stories.')


              setTimeout(
                () => {
                  this.notificationService.showNotification(`You have used ${this.user?.freeRead.length} out of 3 free reads.`);
                }, 5000);
            }
          }


          this.visibleContent = this.story?.content || '';
          this.hiddenContent = '';
        

        }
      }));
    })
  );

    this.checkIfSaved();
    this.checkIfLiked();
  }


  get sanitizedContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.visibleContent);
  }
  

  showFullContent() {
    Swal.fire({
      icon: 'info',
      title: 'Access Denied',
      text: 'Subscribe to Prime to read the full story!',
    });
  }

  trackStoryRead(): void {
    if (sessionStorage.getItem(`read_${this.storyId}`)) {

      return;
    }


    if (!this.story) return;

   this.subscriptions.push(this.storyApiService.trackStoryRead(
      this.userId,
      this.story.authorId ?? '',
      this.storyId,
      this.story.paid ?? false
    ).subscribe(

      (error) => console.error('Error tracking story read:', error)
    ));

  }

  checkIfSaved() {
    this.subscriptions.push( this.storyApiService.isStorySaved(this.userId, this.storyId).subscribe(response => {
      this.isSaved = response;
    }, error => {
      console.error('Error checking saved status', error);
    }));
  }

  checkIfLiked() {
    this.subscriptions.push(this.storyApiService.isStoryLiked(this.userId, this.storyId).subscribe(response => {
      this.isLiked = response;
    }, error => {
      console.error('Error checking liked status', error);
    }));
  }

  toggleLikeStory() {
    if (this.isLiked) {
      this.subscriptions.push(this.storyApiService.unlikeStory(this.userId, this.storyId).subscribe(() => {
        this.isLiked = false;
        this.likeCount = Math.max(0, this.likeCount - 1);
        Swal.fire({
          icon: "success",
          title: "Like Removed",
          showConfirmButton: false,
          timer: 1500
        });
      }, error => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to unlike the story. Please try again.',
        });
      }));
    } else {
      this.subscriptions.push( this.storyApiService.likeStory(this.userId, this.storyId).subscribe(() => {
        this.isLiked = true;
        this.likeCount += 1;
        Swal.fire({

          icon: "success",
          title: "Story Liked",
          showConfirmButton: false,
          timer: 1500
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to like the story. Please try again.',
        });
      }));
    }
  }
  toggleSaveStory() {
    if (this.isSaved) {
      this.subscriptions.push(this.storyApiService.unsaveStory(this.userId, this.storyId).subscribe(
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
      ));
    } else {
      this.subscriptions.push( this.storyApiService.saveStory(this.userId, this.storyId).subscribe(
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
      ));
    }
  }


  reportStory() {
    Swal.fire({
      title: "Report this story",
      input: "text",
      inputLabel: "Reason for reporting",
      inputPlaceholder: "Enter your reason here...",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Please enter a reason!");
          return false;
        }
        try {


          return this.storyApiService.reportStory({
            reportedByUserId: this.userId,
            reportedAuthorId: this.story?.authorId,
            reportedStoryId: this.storyId,
            reason: reason,
            isReportAccepted: false,
            isStoryDeleted: false,
            isUserDeleted: false
          }).toPromise();
        } catch (error) {
          Swal.showValidationMessage(`Error: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Report Submitted",
          text: "Your report has been recorded."
        });
      }
    });
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
