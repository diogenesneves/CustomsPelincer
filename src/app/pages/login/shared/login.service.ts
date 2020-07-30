import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {User} from './user.model'

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'

@Injectable()
export class LoginService{

    user:User;    

    public token_id: string

    constructor(private http:HttpClient){

    }
    
    isLoggedIn(): boolean{
        return this.user !== undefined
    }

    login(email: string, password: string): Observable<User>{
        
        let body = JSON.stringify({email: email, password: password});
        const ParseHeaders = {
            headers: new HttpHeaders({
             'Content-Type'  : 'application/json'
            })
           };
        return this.http.post<any>('http://sis.sandrapelincer.com.br/api/users/token.json',
                                            body, ParseHeaders)
                                            .pipe(map(user => {
                                                // login successful if there's a jwt token in the response
                                                if (user.data && user.data.token) {
                                                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                                                    localStorage.setItem('currentUser', JSON.stringify(user.data));
                                                }
                                                this.user = user;
                                                return user;
                                            }));
                                        }
    
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }                                    
                                            
}