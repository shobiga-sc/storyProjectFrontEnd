import { Component } from '@angular/core';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userId: string | null = null;
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1; 
  monthlyViews: Record<string, number> = {};

  constructor(private userApiService: UserApiService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId'); 
    if (this.userId) {
      this.getMonthlyViews();
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  getMonthlyViews(): void {
    if (this.userId) {
      this.userApiService.getMonthlyViews(this.userId, this.year, this.month)
        .subscribe(data => {
          this.monthlyViews = data;
          console.log('Monthly Views:', this.monthlyViews);
        }, error => {
          console.error('Error fetching monthly views', error);
        });
    }
  }

}
