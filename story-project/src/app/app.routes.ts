import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'user',
        loadChildren: () =>
            import('./user/user.module').then((m) => m.UserModule),
        canActivate: [authGuard] 
    },
    {
        path: 'admin',
        loadChildren: () => 
            import('./admin/admin.module').then((m) => m.AdminModule),
        canActivate: [authGuard] 
    }
];
