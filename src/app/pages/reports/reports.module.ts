import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { CalendarModule } from "primeng/calendar"
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';


@NgModule({
  declarations: [
    ReportFormComponent,
    ReportListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    FormsModule,
    ReportsRoutingModule,
    AutoCompleteModule,
    DialogModule,
    CalendarModule,
    FileUploadModule,
    DropdownModule,
    InputMaskModule,
    TableModule
  ]
})
export class ReportsModule { }
