import { Component, Input } from '@angular/core';
import { PayoutService } from '../../services/payout.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { UserApiService } from '../../services/user-api.service'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.css']
})
export class PayoutComponent {
  @Input() writerId: string = '';
  @Input() writerEmail: string = '';
  @Input() amount: number = 0;
  @Input() month: number = 0;
  @Input() year: number = 0;
  @Input() showModal: boolean = false; 
  writerName: string = ''; 
 subscriptions: Subscription[]= [];

  @Output() closeModal: EventEmitter<void> = new EventEmitter();



  constructor(private payoutService: PayoutService, private userApiService: UserApiService) {}

  ngOnInit() {
    if (this.writerId) {
      this.subscriptions.push(  this.userApiService.getUserById(this.writerId).subscribe(response => {
        this.writerName = response.username;
      }));
    }
  }

  processPayout(): void {
    if (!this.writerId || !this.amount || !this.month || !this.year) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all fields.',
        icon: 'error'
      });
      return;
    }

    this.subscriptions.push( this.userApiService.getUserById(this.writerId).subscribe(response => {
      const payoutData = {
        writerId: this.writerId,
        writerEmail: this.writerEmail,
        amount: this.amount,
        month: this.month,
        year: this.year,
        writerName: response.username 
      };

      this.subscriptions.push(  this.payoutService.processPayout(payoutData).subscribe(
        () => {
          Swal.fire({
            title: 'Success',
            text: 'Payout processed successfully.',
            icon: 'success'
          });
          this.closeModal.emit();  
        },
        () => {
          Swal.fire({
            title: 'Error',
            text: 'No account details found. Failed to process payout. Please try again.',
            icon: 'error'
          });
        }
      ));
    }));
  }

  closeModalAction(): void {
    this.closeModal.emit();  
  }

  ngOnDestory(){
    this.subscriptions.forEach(
      subscription => {
        subscription.unsubscribe();
      }
    )
  }
}
