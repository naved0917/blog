import { Injectable } from '@angular/core';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<SocialUser | null> = new BehaviorSubject<SocialUser | null>(null);
  public user$: Observable<SocialUser | null> = this.userSubject.asObservable();

  constructor(
    private socialAuthService: SocialAuthService,
    private http: HttpClient
  ) { }

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
      this.userSubject.next(user);
      this.authenticateBackend(user.idToken, 'google');
    });
  }

  loginWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
      this.userSubject.next(user);
      this.authenticateBackend(user.authToken, 'facebook');
    });
  }

  private authenticateBackend(token: string, provider: 'google' | 'facebook') {
    this.http.post(`${environment.apiUrl}auth/` + provider, { token }).subscribe(
      (response: any) => {
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
        }
      },
      (error) => {
        console.error('Authentication failed', error);
      }
    );
  }

  logout() {
    this.socialAuthService.signOut().then(() => {
      this.userSubject.next(null);
      localStorage.removeItem('access_token');
    });
  }
}
