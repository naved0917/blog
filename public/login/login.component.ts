import { Component } from '@angular/core';
import { AuthenticationService } from '../../core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(
    private _authService: AuthenticationService
  ) { }

  signInWithGoogle() {
    this._authService.loginWithGoogle();
  }

  signInWithFacebook() {
    this._authService.loginWithFacebook();
  }

  logout() {
    this._authService.logout();
  }
}
