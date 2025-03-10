import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showNotification(message: string, title: string = 'Notification', type: 'success' | 'error' | 'info' = 'info') {
    if (type === 'success') {
      this.toastr.success(message, title);
    } else if (type === 'error') {
      this.toastr.error(message, title);
    } else {
      this.toastr.info(message, title);
    }
  }
}
