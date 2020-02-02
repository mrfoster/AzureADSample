import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { Observable, ReplaySubject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  flatMap,
  map
} from 'rxjs/operators';
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
    private router: Router,
    private httpClient: HttpClient
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
      // scope: `openid profile email ${this.config.auth.apiScope}`,

      scope: `openid profile email User.Read`,
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
        first(),
        flatMap(
          e =>
            this.httpClient.get(
              'https://graph.microsoft.com/v1.0/me/photo/$value',
              {
                responseType: 'arraybuffer'
              }
            )
          // TODO: convert image response to base64 and cache
        ),
        flatMap(r => {
          this.oAuthService.scope = `openid profile email ${this.config.auth.apiScope}`;
          // TODO: how to request new scope interactively?
          return this.oAuthService.silentRefresh();
        })
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
