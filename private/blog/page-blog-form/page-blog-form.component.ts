import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIENDPOINTS, ApiMethods, ERROR_MESSAGE, REQUIRED_FIELDS, Toaster } from '../../../core/constants';
import { HttpService } from '../../../core/services/http.service';

@Component({
  selector: 'app-page-blog-form',
  standalone: false,
  templateUrl: './page-blog-form.component.html',
  styleUrl: './page-blog-form.component.scss'
})
export class PageBlogFormComponent implements OnInit {
  formGroup!: FormGroup;
  serviceSubscription: Subscription[] = [];
  blogId: any;
  blogDetail: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _httpService: HttpService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
    if (this._activatedRoute.snapshot.paramMap.get('id')) {
      this.blogId = this._activatedRoute.snapshot.paramMap.get('id');
      this.getBlogDetailsById()
    }
  }

  buildForm(): void {
    this.formGroup = this._formBuilder.group({
      postName: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
    })
  }

  getBlogDetailsById(): void {
    this.serviceSubscription.push(
      this._httpService.apiCall(APIENDPOINTS.GET_BLOG_DETAIL_BY_ID, ApiMethods.POST, {}, '', this.blogId).subscribe({
        next: ((response: any) => {
          if (Object?.keys(response?.data)?.length > 0) {
            this.blogDetail = response?.data;
            this.patchForm(response?.data);
          }
        }),
        error: ((error) => {
          let message = error?.message ? error.message : ERROR_MESSAGE;
          console.log('message', message);
        })
      })
    )
  }

  patchForm(data: any): void {
    this.formGroup.patchValue({
      postName: data && data?.postName ? data?.postName : '',
      category: data && data?.category ? data?.category : '',
      description: data && data?.description ? data?.description : '',
      postImage: data && data?.postImage ? data?.postImage : '',
    })
  }

  onSubmit(): void {
    if (!this.formGroup.valid) {
      alert(REQUIRED_FIELDS);
      this.formGroup.markAllAsTouched();
      return;
    } else {
      const formData = this.formGroup.value;
      const payload: any = {
        postName: formData?.postName ? formData?.postName : '',
        category: formData?.category ? formData?.category : '',
        description: formData?.description ? formData?.description : '',
        postImage: formData?.postImage ? formData?.postImage : '',
      };
      if (this.blogId) {
        payload.id = this.blogId;
      }
      this.saveAndUpdateBlog(payload);
    }
  }

  saveAndUpdateBlog(payload: any): void {
    let endPoint: any;
    if (this.blogId) {
      endPoint = APIENDPOINTS.UPDATE_BLOG;
    } else {
      endPoint = APIENDPOINTS.CREATE_BLOG;
    }
    this.serviceSubscription.push(
      this._httpService.apiCall(endPoint, ApiMethods.POST, payload).subscribe({
        next: ((response: any) => {
          if (Object?.keys(response?.data)?.length > 0) {
            this._router.navigateByUrl('/private/dashboard');
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
