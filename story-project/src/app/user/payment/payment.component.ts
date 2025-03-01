import { Component, Input } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';

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

  constructor(private paymentService: PaymentService, private router: Router) {}

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
          description: 'Prime Subscription - ₹499',
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
        console.error('Payment initiation failed', error);
        alert('Payment failed! Please try again.');
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
        alert('Payment successful! You are now a Prime subscriber.');
        this.router.navigate(['/']); 
      },
      (error) => {
        console.error('Payment verification failed', error);
      }
    );
  }
}
