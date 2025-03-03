import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserApiService } from '../../services/user-api.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { Story } from '../../models/story.model';
import { StoryApiService } from '../../services/story-api.service';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from '../payment/payment.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, PaymentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userId: string | null = null;
  user: User|null = null;
  stories: Story[] = [];
  filteredStories: Story[] = [];
 

  constructor(private userApiService: UserApiService,
    private storyApiService: StoryApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
   

    this.userApiService.getUserById(localStorage.getItem('userId') as string).subscribe(
      (data: User) => { 
        this.user = data;
        console.log(data);
      }
    );

    this.storyApiService.getAllPublishedStories().subscribe(
      (data: Story[]) => { 
        this.stories = data;
        this.filteredStories = [...this.stories];
      }
    );
  }
  searchStories(event: any): void {
    const query = event?.target?.value?.toLowerCase().trim() || '';
  
    if (query === '') {
      this.filteredStories = [...this.stories];
      return;
    }
  
    this.filteredStories = this.stories.filter(story =>
      story?.title?.toLowerCase().includes(query) ||
      story?.authorName?.toLowerCase().includes(query) ||
      story?.genre?.toLowerCase().includes(query) ||
      (story?.tags && story.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }
  
  
  

 

  navigateTo(route: string) {
    this.router.navigate([`/user/${route}`]);
  
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
  
        Swal.fire({
          icon: 'success',
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
          showClass: {
            popup: 'animate__animated animate__fadeInUp animate__faster'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutDown animate__faster'
          }
        }).then(() => {
          this.router.navigate(['']);
        });
      }
    });
  }
  





}
