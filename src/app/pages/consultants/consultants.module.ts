import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {FileUploadModule} from 'primeng/fileupload';
import {TableModule} from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { SearchPipe } from 'src/app/shared/shared/search.pipe';
import { ConsultantsListComponent } from './consultants-list/consultants-list.component';
import { ConsultantsFormComponent } from './consultants-form/consultants-form.component';
import { ConsultantsRoutingModule } from './consultants-routing.module';
import { InputMaskModule } from 'primeng/inputmask';



@NgModule({
  declarations: [ConsultantsListComponent, ConsultantsFormComponent],
  imports: [
    CommonModule,
    ConsultantsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    ProgressSpinnerModule,
    TableModule,
    DropdownModule,
    InputMaskModule
  ],
  providers: [
    SearchPipe,
  ]
})
export class ConsultantsModule { }
