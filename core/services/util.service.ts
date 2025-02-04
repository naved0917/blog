import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private _router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  showLoader(): void {
    this.spinner.show();
  }

  hideLoader(): void {
    this.spinner.hide();
  }

  navigateTo(url: string): void {
    this._router.navigateByUrl(url);
  }

  showToaster(title: string, description: string) {
    const timeOut = 5000;
    switch (title) {
      case 'Success':
        this.toastr.success(description, title, {
          timeOut: timeOut,
        });
        break;
      case 'Error':
        this.toastr.error(description, title, {
          timeOut: timeOut,
        });
        break;
      case 'Warning':
        this.toastr.warning(description, title, {
          timeOut: timeOut,
        });
        break;
      case 'Information':
        this.toastr.info(description, title, {
          timeOut: timeOut,
        });
        break;
      case 'Required':
        this.toastr.error(description, title, {
          timeOut: timeOut,
        });
        break;
      default:
        this.toastr.success(description, title, {
          timeOut: timeOut,
        });
    }
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt-token', token);
  }

  getToken(): string | any {
    return localStorage.getItem('jwt-token');
  }

  getRole(): string | any {
    return JSON.parse(localStorage.getItem('jwt-token') || '{}')?.user_type;
  }

  getUserDetail(): string | any {
    return JSON.parse(localStorage.getItem('jwt-token') || '{}');
  }

}
