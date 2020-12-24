import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'https://localhost:44327/api/auth/';

constructor(private http: HttpClient) { }


  // tslint:disable-next-line:typedef
  login(model: any){
    return this.http.post(this.baseUrl + 'login', model)
    .pipe(
      map((Response: any) => {
        const user = Response;
        if ( user ){
          localStorage.setItem('token', user.token);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }
}