import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UtilService } from '.';
import { APIENDPOINTS, ApiMethods } from '../constants';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUserSubject = new BehaviorSubject<any>({});
  currentUserSubjectAsObservable = this.currentUserSubject.asObservable();

  constructor(
    private _utilService: UtilService,
    private _httpService: HttpService,
  ) { }

  public get currentUserValue(): any {
    return this.currentUserSubject && this.currentUserSubject.value;
  }

  login(payload: any): Observable<any> {
    return this._httpService.apiCall(APIENDPOINTS.USER_LOGIN, ApiMethods.POST, payload)
      .pipe(map((response: any) => {
        if (response?.data && response?.data.hasOwnProperty('jwt') && response?.data.jwt != '') {
          this._utilService.saveToken(JSON.stringify(response?.data));
          this.currentUserSubject.next(response?.data);
        } else {
          return { ...response, status: 'errror' };
        }
        return { ...response, status: 'success' };
      })
      );
  }

  logout() {
    this._utilService.navigateTo('/auth/login');
    localStorage.clear();
    if (this.currentUserSubject) {
      this.currentUserSubject.next(null);
    }
  }
}
