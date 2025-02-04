import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class AuthCheckGuard implements CanActivate {
    constructor(
        private _authenticationService: AuthenticationService,
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkUserLogin();
    }

    checkUserLogin(): boolean {
        const currentUser = this._authenticationService.currentUserValue;
        if (currentUser) {
            return true;
        }
        this._authenticationService.logout();
        return false;
    }

}
