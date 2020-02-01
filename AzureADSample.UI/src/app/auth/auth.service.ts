import { LocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticatedSubject = new ReplaySubject<boolean>(1);
  public authenticated: Observable<
    boolean
  > = this.authenticatedSubject.asObservable().pipe(distinctUntilChanged());

  constructor(
    private oAuthService: OAuthService,
    private config: Config,
    private locationStrategy: LocationStrategy,
    private router: Router
  ) {
    this.authenticatedSubject.next(this.oAuthService.hasValidAccessToken());
  }

  logIn() {
    this.oAuthService.initLoginFlow(this.router.url);
  }

  logOut() {
    this.oAuthService.logOut();
  }

  init() {
    const origin = `${
      window.location.origin
    }${this.locationStrategy.getBaseHref()}`;

    this.oAuthService.configure({
      issuer: this.config.auth.issuer,
      clientId: this.config.auth.clientId,
      scope: `openid profile email ${this.config.auth.apiScope}`,
      redirectUri: `${origin}index.html`,
      silentRefreshRedirectUri: `${origin}silent-refresh.html`,
      strictDiscoveryDocumentValidation: false,
      skipIssuerCheck: true
    });
    this.oAuthService.tokenValidationHandler = new JwksValidationHandler();

    this.oAuthService.setupAutomaticSilentRefresh();

    this.oAuthService.events
      .pipe(
        map(() => this.oAuthService.hasValidAccessToken()),
        distinctUntilChanged()
      )
      .subscribe(authenticated => {
        const claims = this.oAuthService.getIdentityClaims() as any;

        if (claims) {
          this.oAuthService.customQueryParams = claims.preferred_username
            ? { login_hint: claims.preferred_username }
            : {};
          const tid = claims.tid || 'organizations';
          this.oAuthService.loginUrl = `https://login.microsoftonline.com/${tid}/oauth2/v2.0/authorize`;
        }

        this.authenticatedSubject.next(authenticated);
      });

    this.oAuthService.events
      .pipe(
        filter(e => e.type === 'token_received'),
        first()
      )
      .subscribe(e => {
        const returnUrl = this.oAuthService.state;
        if (returnUrl) {
          // TODO: how to remove this timeout?
          setTimeout(() => this.router.navigateByUrl(returnUrl), 100);
        }
      });

    return this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }
}
