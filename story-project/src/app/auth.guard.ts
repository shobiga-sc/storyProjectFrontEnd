import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');

  if (!token) {
    router.navigate(['/']); 
    return false;
  }

  if (state.url.startsWith('/admin') && role !== 'ROLE_ADMIN') {
    router.navigate(['/user']); 
    return false;
  }

  return true;
};
