import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserApiService } from '../../services/user-api.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private userApiService: UserApiService) {

  }
  login() {
    const credentials = { username: this.username, password: this.password };
  
    this.authService.login(credentials).subscribe({
      next: (response) => {
        const token = response.token;
        const role = response.roles[0];
        const userId = response.id;
  
        this.authService.saveToken(token, role);
        localStorage.setItem('userId', userId);
  
        this.userApiService.getUserById(userId).subscribe(response => {
          if (response.primeSubscriber && response.primeSubscriptionExpiry) {
            const expiryDate = new Date(response.primeSubscriptionExpiry);
            const today = new Date();
  
            if (expiryDate < today) {
              this.userApiService.updatePrimeStatus(userId, false).subscribe(() => {
                console.log('Prime subscription expired, status updated.');
              });
            }
          }
        });
        
        const loginRole: string = (role == "ROLE_USER") ? "USER" : "ADMIN";
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Logged in as ${loginRole}`,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Continue'
        }).then(() => {
          if (role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user']);
          }
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed!',
          text: 'Invalid credentials. Try again.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Retry'
        });
      },
    });
  }
  


}
