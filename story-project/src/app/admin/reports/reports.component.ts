import { Component } from '@angular/core';
import { Report } from '../../models/report.model';
import { StoryApiService } from '../../services/story-api.service';
import { UserApiService } from '../../services/user-api.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

  reports: Report[] = [];
 subscriptions: Subscription[] = [];

  constructor(
    private storyApiService: StoryApiService,
    private userApiService: UserApiService
  ) { }

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports() {
    this.subscriptions.push( this.storyApiService.getAllReports().subscribe((data: any[]) => {
      const reportsWithNames = data.map(report => ({
        ...report,
        isReportAccepted: report.reportAccepted,
        isStoryDeleted: report.storyDeleted,
        isUserDeleted: report.isUserDeleted,
      }));
  
      reportsWithNames.forEach(report => {
        this.subscriptions.push(  this.userApiService.getUserById(report.reportedByUserId).subscribe(user => {
          report.reportedByName = user.username;
        }));
  
        this.subscriptions.push(  this.userApiService.getUserById(report.reportedAuthorId).subscribe(user => {
          report.reportedAuthorName = user.username;
        }));
      });
  
      this.reports = reportsWithNames;
    }));
  }
  

  acceptReport(report: Report) {
    this.subscriptions.push( this.storyApiService.updateReportStatus(report.id ?? '', { isReportAccepted: true }).subscribe(() => {
      report.isReportAccepted = true;
      Swal.fire('Accepted!', 'Report has been accepted.', 'success');
    }));
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
        this.subscriptions.push(  this.storyApiService.deleteStory(storyId).subscribe(() => {
          report.isStoryDeleted = true;
          this.subscriptions.push(  this.storyApiService.updateReportStatus(report.id ?? '', { isStoryDeleted: true }).subscribe());

          Swal.fire('Deleted!', 'The story has been removed.', 'success');
        }));
      }
    });
  }



  deleteUser(userId: string, report: Report) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the account along with all the user stories!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete everything!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {


        this.subscriptions.push( this.storyApiService.deleteStoriesByUserId(userId).subscribe(() => {

          this.subscriptions.push( this.userApiService.deleteUserById(userId).subscribe({
            next: (response) => {
              if (typeof response === 'string' && response.includes('User deleted')) {
                report.isUserDeleted = true;
                report.isStoryDeleted = true;
                
                this.storyApiService.updateReportStatus(report.id ?? '', { isUserDeleted: true, isStoryDeleted: true }).subscribe();
                
                Swal.fire('Deleted!', 'The user account and stories have been removed.', 'success');
              }
            },
            error: (error) => {
              if (error.status === 200 || error.status === 204) {
               
                report.isUserDeleted = true;
                report.isStoryDeleted = true;
                
                this.storyApiService.updateReportStatus(report.id ?? '', { isUserDeleted: true, isStoryDeleted: true }).subscribe();
                
                Swal.fire('Deleted!', 'The user account and stories have been removed.', 'success');
              } else {
                Swal.fire('Error!', 'Something went wrong.', 'error');
              }
            }
          }));
          
        }));
      }
    });
  }

  ngOnDestory(){
    this.subscriptions.forEach(
      subscription => {
        subscription.unsubscribe();
      }
    )
  }


}
