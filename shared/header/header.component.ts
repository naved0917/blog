import { Component } from '@angular/core';
import { AuthenticationService, UtilService } from '../../core/services';
import { LOGIN_MENU_LIST, WITHOUT_LOGIN_MENU_LIST } from '../../core/constants';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentUser: any;
  menuList: any[] = [];

  constructor(
    private _utilService: UtilService,
    private _authenticationService: AuthenticationService
  ) {

  }

  ngOnInit(): void {
    this.currentUser = this._utilService.getUserDetail();
  }

  ngDoCheck(): void {
    if (this.currentUser?._id) {
      this.menuList = LOGIN_MENU_LIST;
    } else {
      this.menuList = WITHOUT_LOGIN_MENU_LIST;
    }
  }

  onLogout(): void {
    this._authenticationService.logout();
  }

}
