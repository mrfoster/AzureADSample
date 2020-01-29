import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-page',
  templateUrl: 'user-page.component.html'
})
export class UserPageComponent implements OnInit {
  claims: object;
  scopes: object;
  user$: Observable<any>;

  constructor(
    private readonly oauthService: OAuthService,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.claims = this.oauthService.getIdentityClaims();
    this.scopes = this.oauthService.getGrantedScopes();
    this.user$ = this.userService.get();
  }

  signOut() {
    this.oauthService.logOut();
  }
}
