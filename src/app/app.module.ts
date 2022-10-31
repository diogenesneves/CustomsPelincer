import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchPipe } from './shared/shared/search.pipe';

import { NgxPrinterModule } from 'ngx-printer';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { LoginModule } from './pages/login/login.module';
import { LoginService } from './pages/login/shared/login.service';
import { AuthGuard } from './guards/auth.guard';
import { JwtInterceptor } from './guards/jwt.interceptor';
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";


//import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDatabase } from './in-memory-database';

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  declarations: [
    AppComponent,
    SearchPipe,
    
  ],
  imports: [
    BrowserModule,
    LoginModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NgxPrinterModule.forRoot({printOpenWindow: true})

    //HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase)
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LoginService,
    AuthGuard,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },  
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
