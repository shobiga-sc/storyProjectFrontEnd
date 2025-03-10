import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrConfig } from 'ngx-toastr';

import { routes } from './app.routes';


const toastrConfig: Partial<ToastrConfig> = {
  timeOut: 3000,
  positionClass: 'toast-top-right', 
  closeButton: true,
  progressBar: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideToastr(toastrConfig), 
  ],
};
