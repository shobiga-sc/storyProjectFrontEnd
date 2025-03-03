import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ReportsComponent } from './reports/reports.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule, AdminDashboardComponent, ReportsComponent,
    RouterModule.forChild(
      [
        {path:"", component: AdminDashboardComponent},
        {path:"reports", component: ReportsComponent}
      ]
    )
  ]
})
export class AdminModule { }
