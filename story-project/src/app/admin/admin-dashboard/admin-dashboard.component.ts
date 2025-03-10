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
import { Chart } from 'chart.js/auto';
import { User } from '../../models/user.model';


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

  totalReadsPerAuthor: any[] = [];  

  @ViewChild('chartCanvas') chartCanvas: any; 

  chartInstance: Chart | undefined;

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
        const authorNamesPromises = data.map((writer: any) => 
          this.userService.getUserById(writer.authorId).toPromise()
        );
    
        Promise.all(authorNamesPromises).then(users => {
          this.earnings = data.map((writer: any, index: number) => ({
            authorId: writer.authorId,
            authorName: users[index]?.username || 'Unknown',
            paidReads: Number(writer.paidReads) || 0,
            unpaidReads: Number(writer.unpaidReads) || 0,
            popularityScore: Number(writer.popularityScore.toFixed()) || 0,
            earnings: Number(writer.earnings) || 0
          }));
        }).catch(error => {
          console.error('Error fetching author names', error);
        });
      },
      (error) => {
        console.error('Error fetching writer earnings', error);
        this.earnings = [];
      }
    );
    

    
    this.statsService.getTotalReadsPerAuthor(this.selectedMonth, this.selectedYear).subscribe(data => {
      this.totalReadsPerAuthor = data;
      
      this.createChart(); 
    });
  }

  createChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  
    if (this.totalReadsPerAuthor && this.totalReadsPerAuthor.length > 0) {
      const authorIds = this.totalReadsPerAuthor.map(author => author._id);
      const totalReads = this.totalReadsPerAuthor.map(author => author.totalReads);
  
      const authorNamesPromises = authorIds.map(authorId => this.userService.getUserById(authorId).toPromise());
  
      Promise.all(authorNamesPromises).then(usernames => {
        const labels = usernames.map(user => user?.username || 'Unknown');
        const chartData = {
          labels: labels,
          datasets: [{
            label: 'Total Reads per Author',
            data: totalReads,
            backgroundColor: 'rgb(255, 81, 18)', 
            hoverBackgroundColor: 'rgb(255, 81, 18)', 
            borderColor: 'rgb(255, 81, 18)', 
            borderWidth: 1 
          }]
        };
        this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
          type: 'bar',
          data: chartData
        });
      }).catch(error => {
        console.error('Error fetching author usernames:', error);
        this.createEmptyChart();
      });
    } else {
      this.createEmptyChart();
    }
  }
  
  createEmptyChart(): void {
    const labels = ['No Data Available'];
    const totalReads = [0];
  
    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Total Reads per Author',
        data: totalReads,
        backgroundColor: 'rgb(255, 81, 18)',
        hoverBackgroundColor: 'rgb(255, 81, 18)',
        borderColor: 'rgb(255, 81, 18)',
        borderWidth: 1
      }]
    };
  
    this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: chartData
    });
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
