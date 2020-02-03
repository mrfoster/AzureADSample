import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { Observable, ReplaySubject, timer } from 'rxjs';
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
        flatMap(() => this.onReceivedFirstToken())
      )
      .subscribe();

    return this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  private async onReceivedFirstToken() {
    const returnUrl = this.oAuthService.state;
    const scopes = this.oAuthService.getGrantedScopes() as string[];
    this.oAuthService.scope = `openid profile email ${this.config.auth.apiScope}`;

    if (scopes.includes('User.Read')) {
      await this.httpClient
        .get('https://graph.microsoft.com/v1.0/me/photo/$value', {
          responseType: 'arraybuffer'
        })
        .toPromise();

      // TODO: convert to base64 and cache
    }

    if (!scopes.includes(this.config.auth.apiScope)) {
      this.oAuthService.initImplicitFlow(returnUrl);
      return;
    }

    if (returnUrl) {
      // TODO: how to remove this timeout?
      await timer(100).toPromise();

      this.router.navigateByUrl(returnUrl);
    }
  }
}
