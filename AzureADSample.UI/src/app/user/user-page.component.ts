import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { merge, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: 'user-page.component.html'
})
export class UserPageComponent implements OnInit {
  model$: Observable<{ scopes: any; claims: any; user: any }>;

  constructor(
    private readonly oauthService: OAuthService,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.model$ = merge(
      of(this.oauthService.hasValidAccessToken()),
      this.oauthService.events
    )
      .pipe(map(() => this.oauthService.hasValidAccessToken()))
      .pipe(
        flatMap(authenticated =>
          authenticated ? this.userService.get() : of(null)
        ),
        map(user => ({
          scopes: this.oauthService.getGrantedScopes(),
          claims: this.oauthService.getIdentityClaims(),
          user
        }))
      );
  }

  refreshToken() {
    this.oauthService.silentRefresh();
  }
}
