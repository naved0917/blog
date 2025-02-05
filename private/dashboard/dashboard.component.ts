import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIENDPOINTS, ApiMethods, ERROR_MESSAGE } from '../../core/constants';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  serviceSubscription: Subscription[] = [];
  blogList: any[] = [];

  constructor(
    private _httpService: HttpService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.getBlogList();
  }

  getBlogList(): void {
    this.serviceSubscription.push(
      this._httpService.apiCall(APIENDPOINTS.GET_BLOG_LIST, ApiMethods.GET, {}).subscribe({
        next: ((response: any) => {
          if (response?.data?.length > 0) {
            this.blogList = response?.data;
          }
        }),
        error: ((error) => {
          let message = error?.message ? error.message : ERROR_MESSAGE;
          console.log('message', message);
        })
      })
    )
  }

  onView(id: any): void {
    this._router.navigateByUrl('/private/blog/detail/' + id);
  }

  onEdit(id: any): void {
    this._router.navigateByUrl('/private/blog/add/' + id);
  }

  onDelete(id: any): void {
    this.serviceSubscription.push(
      this._httpService.apiCall(APIENDPOINTS.DELETE_BLOG, ApiMethods.GET, {}, '', id).subscribe({
        next: ((response: any) => {
          if (response) {
            this.getBlogList();
          }
        }),
        error: ((error) => {
          let message = error?.message ? error.message : ERROR_MESSAGE;
          console.log('message', message);
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
