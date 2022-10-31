import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultantsFormComponent } from './consultants-form/consultants-form.component';
import { ConsultantsListComponent } from './consultants-list/consultants-list.component';

const routes: Routes = [
  { path: '', component: ConsultantsListComponent},
  { path: 'new', component: ConsultantsFormComponent},
  { path: ':id/edit', component: ConsultantsFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultantsRoutingModule { }
