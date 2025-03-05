import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { UserApiService } from '../../services/user-api.service'; 
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminStatsService } from '../../services/admin-stats.service';
import { WriterEarnings } from '../../models/writer-earnings.model';
import { PayoutComponent } from '../payout/payout.component';
import { PayoutService } from '../../services/payout.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, PayoutComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  subscriptionAmount: number = 0;
  totalReads: number = 0;
  paidReads: number = 0;
  unpaidReads: number = 0;
  totalRevenue: number = 0;
  selectedMonth: number = new Date().getMonth() + 1; 
  selectedYear: number = new Date().getFullYear(); 
  earnings: any[] = [];
  platformFee: number = 0;
  appShare: number = 0;
  writerPool: number = 0;
  userRole: string = localStorage.getItem('userRole') as string;

  writerId: string = '';
  writerEmail: string = '';
  amount: number = 0;
  month: number = 0;
  year: number = 0;
  showModal: boolean = false;
  paidWriters: { [key: string]: boolean } = {}; 

  constructor(
    private subscriptionService: SubscriptionService,
    private statsService: AdminStatsService,
    private userService: UserApiService,
    private payoutService: PayoutService
  ) {}

  ngOnInit(): void {
    this.fetchCurrentAmount();
    this.fetchStats();
  }

  fetchCurrentAmount(): void {
    this.subscriptionService.getSubscriptionAmount().subscribe(amount => {
      this.subscriptionAmount = amount;
    });
  }

  updateAmount(): void {
    if (!this.subscriptionAmount) {
      Swal.fire({ title: 'Error', text: "Amount cannot be empty", icon: 'warning' });
      return;
    }

    this.subscriptionService.updateSubscriptionAmount(this.subscriptionAmount).subscribe(response => {
      this.fetchCurrentAmount();
    });
    Swal.fire({ title: 'Success', text: "Updated", icon: 'success' });
  }

  fetchStats(): void {
    this.statsService.getTotalReads(this.selectedMonth, this.selectedYear).subscribe(data => {
      this.totalReads = data || 0;
    });

    this.statsService.getPaidReads(this.selectedMonth, this.selectedYear).subscribe(data => {
      this.paidReads = data || 0;
    });

    this.statsService.getUnpaidReads(this.selectedMonth, this.selectedYear).subscribe(data => {
      this.unpaidReads = data || 0;
    });

    this.statsService.getTotalRevenue(this.selectedMonth, this.selectedYear).subscribe(data => {
      this.totalRevenue = data || 0;
      this.platformFee = Math.round(this.totalRevenue * 0.30);
      this.appShare = Math.round(this.totalRevenue * 0.35);
      this.writerPool = Math.round(this.totalRevenue * 0.35);
    });

    this.statsService.getWriterEarnings(this.selectedMonth, this.selectedYear).subscribe(
      (data: any[]) => {
        this.earnings = data.map((writer: any) => ({
          authorId: writer.authorId,
          paidReads: Number(writer.paidReads) || 0,
          unpaidReads: Number(writer.unpaidReads) || 0,
          popularityScore: Number(writer.popularityScore) || 0,
          earnings: Number(writer.earnings) || 0
        }));
      },
      (error) => {
        console.error('Error fetching writer earnings', error);
        this.earnings = [];
      }
    );
  }

  openPayoutModal(writer: any): void {
    this.writerId = writer.authorId;
    this.amount = writer.earnings;
    this.month = this.selectedMonth;
    this.year = this.selectedYear;
  
    this.userService.getUserById(this.writerId).subscribe(user => {
      this.writerEmail = user.email;
      this.showModal = true; 
    }, error => {
      Swal.fire({ title: 'Error', text: 'Failed to fetch writer data.', icon: 'error' });
    });
  }

  checkPayout(writerId: string): void {
    this.payoutService.checkPayoutStatus(writerId, this.selectedMonth, this.selectedYear).subscribe(
      (isPaid) => {
        this.paidWriters[writerId] = isPaid;
      }
    );
  }

  isPaid(writerId: string): boolean {
    return this.paidWriters[writerId] ?? false;
  }

  
 
  closeModal(): void {
    this.showModal = false;
  }
}
