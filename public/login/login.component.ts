import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ERROR_MESSAGE, LOGIN_SUCCESSFULLY, REQUIRED_FIELDS, Toaster } from '../../core/constants';
import { AuthenticationService, UtilService } from '../../core/services';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  passwordToggler!: boolean;
  serviceSubscription: Subscription[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _utilService: UtilService,
    private _authenticationService: AuthenticationService,
  ) {
    this.passwordToggler = true;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formGroup = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  passwordTogglerFun() {
    this.passwordToggler = !this.passwordToggler;
  }

  onSubmit(): void {
    if (!this.formGroup.valid) {
      this._utilService.showToaster(Toaster.WARNING, REQUIRED_FIELDS);
      this.formGroup.markAllAsTouched();
      return;
    } else {
      const formData = this.formGroup.value;
      const payload: any = {
        "username": formData?.username,
        "password": formData.password,
      };
      this._utilService.showLoader();
      this.serviceSubscription.push(
        this._authenticationService.login(payload).subscribe({
          next: ((response: any) => {
            this._utilService.hideLoader();
            if (Object?.keys(response?.data)?.length > 0) {
              this._utilService.showToaster(Toaster.SUCCESS, LOGIN_SUCCESSFULLY);
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
  }

  ngOnDestroy(): void {
    this.serviceSubscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
