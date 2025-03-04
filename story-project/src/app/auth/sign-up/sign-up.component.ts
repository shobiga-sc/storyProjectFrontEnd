import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  username = '';
  password = '';
  email = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    if (!this.username || !this.email || !this.password) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields!',
        text: 'Please fill out all fields.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      roles: ['ROLE_USER'],
      isPrimeSubscriber: false,
      primeSubscriptionExpiry: null,
      followedAuthors: []
    };
  
    this.authService.signup(userData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful!',
          text: 'Please login to continue.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed!',
          text:'Something went wrong. Please try again. ' ,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Retry'
        });
      }
    });
  }
  

}
