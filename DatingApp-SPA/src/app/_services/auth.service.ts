import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/'; 
  
jwtHelper = new JwtHelperService();
decodedToken: any;
currentUser: User;
photoUrl = new BehaviorSubject<string>('../../assets/user.png');
currenPhotoUrl = this.photoUrl.asObservable();

constructor(private http: HttpClient) { }

changeMenmberPhoto(photoUrl: string) {
  this.photoUrl.next(photoUrl);
}

  // tslint:disable-next-line:typedef
  login(model: any){
    console.log(this.baseUrl)
    return this.http.post(this.baseUrl + 'login', model)
    .pipe(
      map((Response: any) => {
        const user = Response;
        if ( user ){
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMenmberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    return Boolean(this.jwtHelper.getTokenExpirationDate(token)).valueOf();

  }
}
