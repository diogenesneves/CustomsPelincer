import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';

import { CalendarModule } from "primeng/calendar"
import {AutoCompleteModule} from 'primeng/autocomplete';
import {LightboxModule} from 'primeng/lightbox';
import {TableModule} from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';

import {IMaskModule} from 'angular-imask';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SearchPipe } from 'src/app/shared/shared/search.pipe';
import { PrintComponent } from './print/print.component';
import { CategoryListStatusComponent } from './category-list-status/category-list-status.component';
import { InputNumberModule } from 'primeng/inputnumber';



@NgModule({
  declarations: [CategoryListComponent, CategoryFormComponent, PrintComponent, CategoryListStatusComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ReactiveFormsModule,
    CalendarModule,
    AutoCompleteModule,
    FormsModule,
    LightboxModule,
    TableModule,
    InputNumberModule,
    ToastModule,
    DropdownModule,
    IMaskModule,
    DialogModule,

  ],
  providers: [
    SearchPipe,
  ]
})
export class CategoriesModule { }
