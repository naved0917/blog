import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../core/services/http.service';
import { UtilService } from '../../../core/services';
import { Subscription } from 'rxjs';
import { APIENDPOINTS, ApiMethods, ERROR_MESSAGE, REQUIRED_FIELDS, Toaster } from '../../../core/constants';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';

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
  imagePreview: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _utilService: UtilService,
    private _httpService: HttpService,
    private _activatedRoute: ActivatedRoute
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
      postImage: ['']
    })
  }

  getBlogDetailsById(): void {
    this._utilService.showLoader();
    this.serviceSubscription.push(
      this._httpService.apiCall(APIENDPOINTS.GET_BLOG_DETAIL_BY_ID, ApiMethods.POST, {}, '', this.blogId).subscribe({
        next: ((response: any) => {
          this._utilService.hideLoader();
          if (Object?.keys(response?.data)?.length > 0) {
            this.blogDetail = response?.data;
            this.imagePreview = response?.data?.postImage;
            this.patchForm(response?.data);
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
      this._utilService.showToaster(Toaster.WARNING, REQUIRED_FIELDS);
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
    this._utilService.showLoader();
    this.serviceSubscription.push(
      this._httpService.apiCall(endPoint, ApiMethods.POST, payload).subscribe({
        next: ((response: any) => {
          this._utilService.hideLoader();
          if (Object?.keys(response?.data)?.length > 0) {
            this._utilService.showToaster(Toaster.SUCCESS, response?.message);
            this._utilService.navigateTo('/private/dashboard');
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

  getUploadedImage(event: any): void {
    const file = event?.target?.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    }

    setTimeout(() => {
      this.uploadImageToServer(file);
    }, 500);
  }

  uploadImageToServer(image: any) {
    this._utilService.showLoader();
    this.serviceSubscription.push(
      this._httpService.uploadImageFile(image).subscribe(
        {
          next: ((response: any) => {
            this._utilService.hideLoader();
            let imageUrl: any;
            response.filenames.forEach((item: any) => {
              imageUrl = environment.apiUrl + '/uploads/' + item;
            });
            this.formGroup.get('postImage')?.setValue(imageUrl);
          }),
          error: ((error: any) => {
            this._utilService.hideLoader();
            let message = error?.message ? error.message : ERROR_MESSAGE;
            this._utilService.showToaster(Toaster.WARNING, message);
          })
        })
    );
  }


  ngOnDestroy(): void {
    this.serviceSubscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
