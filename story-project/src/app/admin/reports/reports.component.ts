import { Component } from '@angular/core';
import { Report } from '../../models/report.model';
import { StoryApiService } from '../../services/story-api.service';
import { UserApiService } from '../../services/user-api.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  
  reports: Report[] = [];
  
  constructor(
    private storyApiService: StoryApiService,
    private userApiService: UserApiService
  ){}

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports() {
    this.storyApiService.getAllReports().subscribe((data: any[]) => {
      this.reports = data.map(report => ({
        ...report,
        isReportAccepted: report.reportAccepted, 
        isStoryDeleted: report.storyDeleted,
        isUserDeleted: report.isUserDeleted
      }));
      console.log("Fetched reports:", this.reports);
    });
  }
  
  acceptReport(report: Report) {
    this.storyApiService.updateReportStatus(report.id ?? '', true).subscribe(() => {
      report.isReportAccepted = true;
      Swal.fire('Accepted!', 'Report has been accepted.', 'success');
    });
  }

  deleteStory(storyId: string, report: Report) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the story!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.storyApiService.deleteStory(storyId).subscribe(() => {
          report.isStoryDeleted = true;  
          Swal.fire('Deleted!', 'The story has been removed.', 'success');
        });
      }
    });
  }
  
  deleteUser(userId: string, report: Report) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete user!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userApiService.deleteUserById(userId).subscribe(() => {
          report.isUserDeleted = true;  
          Swal.fire('Deleted!', 'The user has been removed.', 'success');
        });
      }
    });
  }
  
}
