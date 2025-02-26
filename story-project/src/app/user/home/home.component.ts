import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserApiService } from '../../user-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userId: string | null = null;

  constructor(private userService: UserApiService) { }

  ngOnInit(): void {
    this.userService.getUserId().subscribe({
      next: (id) => {
        this.userId = id;
        console.log('Current User ID:', id);
        console.log(localStorage.getItem('userId'));
      },
      error: (err) => {
        console.error('Error fetching user ID', err);
      }
    });
  }
  


  
}
