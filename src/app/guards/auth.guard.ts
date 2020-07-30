import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
    ) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot, ): Observable<boolean> | boolean {
         if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}