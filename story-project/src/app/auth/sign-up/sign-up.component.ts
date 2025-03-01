import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
            alert('Signup successful! Please login.');
            this.router.navigate(['']);
        },
        error: (err) => {
            alert('Signup failed. Try again.');
        },
    });
}

}
