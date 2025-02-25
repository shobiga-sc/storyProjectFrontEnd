import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RouterModule } from '@angular/router';
import path from 'path';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, SignInComponent, SignUpComponent, 
    RouterModule.forChild([
      { path:'', component: SignInComponent },
      { path:'sign-up', component: SignUpComponent }
    ])
  ],
  exports: []
})
export class AuthModule { 
  
}
