import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { APIENDPOINTS, ApiMethods, ERROR_MESSAGE, Toaster } from '../core/constants';
import { UtilService } from '../core/services';
import { HttpService } from '../core/services/http.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  serviceSubscription: Subscription[] = [];
  blogList: any[] = [];

  constructor(
    private _utilService: UtilService,
    private _httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.getBlogList();
  }

  getBlogList(): void {
    this._utilService.showLoader();
    this.serviceSubscription.push(
      this._httpService.apiCall(APIENDPOINTS.GET_BLOG_LIST, ApiMethods.GET, {}).subscribe({
        next: ((response: any) => {
          this._utilService.hideLoader();
          if (response?.data?.length > 0) {
            this.blogList = response?.data;
          }
        }),
        error: ((error) => {
          this._utilService.hideLoader();
          let message = error?.message ? error.message : ERROR_MESSAGE;
          this._utilService.showToaster(Toaster.WARNING, message);
        })
      })
    )
  }

  onView(id: any): void {
    this._utilService.navigateTo('/private/blog/detail/' + id);
  }

  onEdit(id: any): void {
    this._utilService.navigateTo('/private/blog/add/' + id);
  }

  onDelete(id: any): void {
    this._utilService.showLoader();
    this.serviceSubscription.push(
      this._httpService.apiCall(APIENDPOINTS.DELETE_BLOG, ApiMethods.GET, {}, '', id).subscribe({
        next: ((response: any) => {
          this._utilService.hideLoader();
          if (response) {
            this.getBlogList();
          }
        }),
        error: ((error) => {
          this._utilService.hideLoader();
          let message = error?.message ? error.message : ERROR_MESSAGE;
          this._utilService.showToaster(Toaster.WARNING, message);
        })
      })
    )
  }

  ngOnDestroy(): void {
    this.serviceSubscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
