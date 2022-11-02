import { ReportListComponent } from './report-list/report-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportFormComponent } from './report-form/report-form.component';


const routes: Routes = [
  { path: '', component: ReportFormComponent },
  { path: 'list', component: ReportListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
