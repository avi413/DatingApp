import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/user.service";

@Injectable()
export class MemberDedailResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}
        
        resolve(rout: ActivatedRouteSnapshot): Observable<User> {
            return this.userService.getUser(rout.params['id']).pipe(
                catchError(error => {
                    this.alertify.error('Problam retriving data');
                    this.router.navigate(['/members']);
                    return of(null);
                })
            );
        }
    
}