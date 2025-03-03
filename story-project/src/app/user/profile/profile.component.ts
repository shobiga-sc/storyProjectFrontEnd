import { Component } from '@angular/core';
import { UserApiService } from '../../services/user-api.service';
import { StoryApiService } from '../../services/story-api.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaymentComponent } from '../payment/payment.component';
import { FollowService } from '../../services/follow.service';
import { WriterEarnings } from '../../models/writer-earnings.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, PaymentComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userId: string | null = null;
  user: User | null = null;
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  monthlyViews: { paid: number; unpaid: number } = { paid: 0, unpaid: 0 };
  followersCount = 0;
  followingCount = 0;
  earnings: WriterEarnings | null = null;

  years: number[] = [];
  months: { value: number; name: string }[] = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];

  constructor(
    private userApiService: UserApiService,
    private storyApiService: StoryApiService,
    private followService: FollowService
  ) {
    this.populateYears();
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.userApiService.getUserById(this.userId).subscribe((data: User) => {
        this.user = data;
      });

      this.getMonthlyViews();

      this.followService.getFollowCount(this.userId).subscribe((data) => {
        this.followersCount = data.followersCount;
        this.followingCount = data.followingCount;
      });


      
    }

  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 10; i--) {
      this.years.push(i);
    }
  }



  getMonthlyViews(): void {
    if (this.userId) {
      this.storyApiService.getAuthorMonthlyReads(this.userId, this.year, this.month)
        .subscribe(
          (data: any) => {
            this.monthlyViews = {
              paid: data.PAID || 0,
              unpaid: data.UNPAID || 0
            };
          },
          error => {
            console.error('Error fetching monthly views', error);
          }
        );


        this.storyApiService.getCurrentWriterEarnings(this.userId, this.month, this.year).subscribe(
          (data: WriterEarnings) => {
            this.earnings = {
              authorId: data.authorId || '',
              paidReads: Number(data.paidReads) || 0,
              unpaidReads: Number(data.unpaidReads) || 0,
              popularityScore: Number(data.popularityScore) || 0,
              earnings: Math.round(Number(data.earnings)) || 0 
            };
            console.log(this.earnings);
          },
          (error) => {
            console.error('Error fetching writer earnings', error);
          }
        );
        
    }
  }
  
  

  onMonthChange(event: Event): void {
    this.month = Number((event.target as HTMLSelectElement).value);
    this.getMonthlyViews();
  }

  onYearChange(event: Event): void {
    this.year = Number((event.target as HTMLSelectElement).value);
    this.getMonthlyViews();
  }

  getMonthName(month: number): string {
    return this.months.find(m => m.value === month)?.name || 'Unknown Month';
  }
  
}
