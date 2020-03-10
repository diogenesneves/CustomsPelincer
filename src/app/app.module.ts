import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchPipe } from './shared/shared/search.pipe';

import { NgxPrinterModule } from 'ngx-printer';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';


//import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDatabase } from './in-memory-database';

@NgModule({
  declarations: [
    AppComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPrinterModule.forRoot({printOpenWindow: true})

    //HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase)
  ],
  providers: [
    {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
