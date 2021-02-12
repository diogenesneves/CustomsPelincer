import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from "primeng/calendar"
import {FileUploadModule} from 'primeng/fileupload';
import {TableModule} from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { SearchPipe } from 'src/app/shared/shared/search.pipe';
import { ClientFormComponent } from './clients-form/client-form.component';
import { ClientListComponent } from './client-list/client-list.component';
import { InputMaskModule } from 'primeng/inputmask';


@NgModule({
  declarations: [ClientListComponent, ClientFormComponent],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    FileUploadModule,
    TableModule,
    DropdownModule,
    InputMaskModule
  ],
  providers: [
    SearchPipe,
  ]
})
export class ClientsModule { }
