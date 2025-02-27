import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIENDPOINTS, ApiMethods, ERROR_MESSAGE } from '../../../core/constants';
import { HttpService } from '../../../core/services/http.service';

@Component({
  selector: 'app-page-blog-detail',
  standalone: false,
  templateUrl: './page-blog-detail.component.html',
  styleUrl: './page-blog-detail.component.scss'
})
export class PageBlogDetailComponent implements OnInit {
  serviceSubscription: Subscription[] = [];
  blogId: any;
  blogDetails: any = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _httpService: HttpService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this._activatedRoute.snapshot.paramMap.get('id')) {
      this.blogId = this._activatedRoute.snapshot.paramMap.get('id');
      this.getBlogDetail();
    }

  }

  getBlogDetail(): void {
    this.serviceSubscription.push(
      this._httpService.apiCall(APIENDPOINTS.GET_BLOG_DETAIL_BY_ID, ApiMethods.POST, {}, '', this.blogId).subscribe({
        next: ((response: any) => {
          if (Object?.keys(response?.data)?.length > 0) {
            this.blogDetails = response?.data;
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
