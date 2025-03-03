import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminStatsService } from '../../services/admin-stats.service';
import { WriterEarnings } from '../../models/writer-earnings.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
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


  constructor(private subscriptionService: SubscriptionService,
    private statsService: AdminStatsService
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
    this.subscriptionService.updateSubscriptionAmount(this.subscriptionAmount).subscribe(response => {
      Swal.fire('Success', response, 'success');
      this.fetchCurrentAmount();
    });
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
      this.appShare =   Math.round(this.totalRevenue * 0.35);
      this.writerPool =   Math.round(this.totalRevenue * 0.35);
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
        console.log(data);
      },
      (error) => {
        console.error('Error fetching writer earnings', error);
        this.earnings = [];
      }
    );
  }
  
}
