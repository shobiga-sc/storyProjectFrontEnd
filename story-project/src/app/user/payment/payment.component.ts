import { Component, Input } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import Swal from 'sweetalert2';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  @Input() userId!: string;
  isLoading = false;
  subscriptionAmount: number = 0;

  constructor(private paymentService: PaymentService, private router: Router,
    private subscriptionService: SubscriptionService

  ) { }

  ngOnInit() {
    this.subscriptionService.getSubscriptionAmount().subscribe(amount => {
      this.subscriptionAmount = amount;
    });
  }

  initiatePayment() {
    this.isLoading = true;

    this.paymentService.createOrder(this.userId).subscribe(
      (order: any) => {
        this.isLoading = false;

        const options = {
          key: 'rzp_test_A63Lq9fag9PjN2',
          amount: order.amount,
          currency: order.currency,
          name: 'Story App',
          description: `Prime Subscription - ₹${this.subscriptionAmount}`,
          order_id: order.id,
          handler: (response: any) => {
            this.verifyPayment(response.razorpay_payment_id, response.razorpay_order_id);
          },
          prefill: {
            name: 'User Name',
            email: 'user@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#3399cc'
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      },
      (error) => {
        this.isLoading = false;
      
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed!',
          text: 'There was an issue processing your payment. Please try again.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Retry'
        });
      }
    );
  }

  verifyPayment(paymentId: string, orderId: string) {
    const paymentData = {
      userId: localStorage.getItem('userId'),
      paymentId: paymentId,
      orderId: orderId
    };

    this.paymentService.verifyPayment(paymentData).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: 'You are now a Prime subscriber.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/user']);
        });
      },
      (error) => {
        console.error('Payment verification failed', error);
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed!',
          text: 'There was an issue verifying your payment. Please try again.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Retry'
        });
      }
    );
  }
}
