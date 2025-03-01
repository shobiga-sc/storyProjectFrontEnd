import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const credentials = { username: this.username, password: this.password };
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
      
        const token = response.token;
        const role = response.roles[0]; 
        const userId = response.id;

        
        this.authService.saveToken(token, role);
        localStorage.setItem('userId', userId); 
       

        alert(`Login successful as ${role}`);
        
        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/user']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: () => {
        alert('Invalid credentials. Try again.');
      },
    });
  }
  
  


}
