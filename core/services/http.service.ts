import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiMethods, ERROR_MESSAGE } from '../constants';
import { APIENDPOINTS } from '../constants/apiendpoints';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl!: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }


  apiCall(api: APIENDPOINTS, method: ApiMethods, payload: any, queryString: string = '', routeParam: string = ''): Observable<any> {
    let response: any;
    switch (method) {
      case ApiMethods.GET:
        let q = routeParam != '' && queryString !== '' ? '/' + routeParam + '?' + queryString : routeParam != '' ? '/' + routeParam : (queryString !== '' ? '?' + queryString : '');
        response = this.http.get(`${this.apiUrl}${api + q}`)
          .pipe(catchError(((err: HttpErrorResponse) => this.handleError(err)
          )));
        break;
      case ApiMethods.POST:
        let q1 = routeParam != '' ? '/' + routeParam : (queryString !== '' ? '?' + queryString : '');
        response = this.http.post(`${this.apiUrl}${api + q1}`, payload)
          .pipe(catchError(((err: HttpErrorResponse) => this.handleError(err)
          )));
        break;
      case ApiMethods.PATCH:
        let q2 = routeParam != '' ? '/' + routeParam : '';
        response = this.http.patch(`${this.apiUrl}${api + q2}`, payload)
          .pipe(catchError(((err: HttpErrorResponse) => this.handleError(err)
          )));
        break;
      case ApiMethods.DELETE:
        let q3 = routeParam != '' ? '/' + routeParam : (queryString !== '' ? '?' + queryString : '');
        response = this.http.delete(`${this.apiUrl}${api + q3}`, { body: payload })
          .pipe(catchError(((err: HttpErrorResponse) => this.handleError(err)
          )));
        break;
      case ApiMethods.PUT:
        let q4 = routeParam != '' ? '/' + routeParam : (queryString !== '' ? '?' + queryString : '');
        response = this.http.put(`${this.apiUrl}${api + q4}`, payload)
          .pipe(catchError(((err: HttpErrorResponse) => this.handleError(err)
          )));
        break;
      default:
        break;
    }
    return response;
  }

  handleError(error: HttpErrorResponse): any {
    const errorResponse = { message: error?.error?.text ? error?.error?.text : error?.error?.message || ERROR_MESSAGE, statusText: error?.statusText, status: error?.status };
    return throwError(errorResponse);
  }

}
