import { Component } from '@angular/core';
import { LoginService } from './pages/login/shared/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'customs';
  constructor(private loginService: LoginService
    ){
  }
  logout(){
    this.loginService.logout();
  }
  logedIn(){
    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      return true;
    }
  }
}
