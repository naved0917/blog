import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ERROR_MESSAGE, SESSION_EXPIRED, Toaster } from '../constants';
import { AuthenticationService, UtilService } from '../services';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    auth: any;
    currentUser: any;
    isLoggedIn: any;
    isRefreshing: boolean = false;
    constructor(
        private _authenticationService: AuthenticationService,
        private _utilService: UtilService
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
        this.currentUser = this._authenticationService.currentUserValue;
        this.isLoggedIn = this.currentUser && this.currentUser.jwt;
        if (this.isLoggedIn) {
            if (request.url.indexOf('geocode') == -1) {
                if (request.url.indexOf('refreshToken') > -1) {
                    const refresh_token = this.currentUser?.refresh_token;
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${refresh_token}`,
                        },
                    });
                } else {
                    let token = this.currentUser.jwt;
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }

            }

        }
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                return this.handleError(error, request, next);
            }));
    }

    private handleError(error: any | Response, request: HttpRequest<any>, next: HttpHandler) {
        if (error.status === 401) {
            this._utilService.showToaster(Toaster.ERROR, SESSION_EXPIRED)
            this._authenticationService.logout();
        } else if (error.status === 400) {
            if (error.error?.message) {
                this._utilService.showToaster(Toaster.ERROR, error.error?.message);
                return throwError(error);
            }
        } else if (error.status === 0 || error.status === 404) {
            this._utilService.hideLoader();
            this._utilService.showToaster(Toaster.ERROR, error?.message ? error.message : ERROR_MESSAGE);
            return throwError(error);
        } else {
            return throwError(error);
        }
        return error.status > 399 ? throwError(error) : of(error);
    }
}
