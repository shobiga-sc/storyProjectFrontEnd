import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './app/auth.interceptor';
import { provideToastr } from 'ngx-toastr'; 

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), 
    provideAnimationsAsync(),
    provideToastr({

      positionClass: 'toast-top-right', 
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
      tapToDismiss: false,
      preventDuplicates: true,
      enableHtml: true,
    }), 
  ],
})
  .catch((err) => console.error(err));
