import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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


//import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDatabase } from './in-memory-database';

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
    NgxPrinterModule.forRoot({printOpenWindow: true})

    //HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase)
  ],
  providers: [
    LoginService,
    AuthGuard,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },  

    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
