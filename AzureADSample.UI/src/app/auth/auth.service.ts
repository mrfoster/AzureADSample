import { isPlatformServer, LocationStrategy } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authorisedSubject = new BehaviorSubject(false);
  public authorised: Observable<
    boolean
  > = this.authorisedSubject.asObservable();

  constructor(
    private oAuthService: OAuthService,
    private router: Router,
    private config: Config,
    private locationStrategy: LocationStrategy,

    @Inject(PLATFORM_ID) readonly platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    this.authorisedSubject.next(this.oAuthService.hasValidAccessToken());
  }

  logOut() {
    this.oAuthService.logOut();
    this.authorisedSubject.next(false);
    this.router.navigateByUrl('/');
  }

  init() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const origin = `${
      document.location.origin
    }${this.locationStrategy.getBaseHref()}`;

    this.oAuthService.configure({
      issuer: this.config.auth.issuer,
      skipIssuerCheck: true,
      redirectUri: `${origin}index.html`,
      silentRefreshRedirectUri: `${origin}silent-refresh.html`,
      clientId: this.config.auth.clientId,
      scope: this.config.auth.scope,
      strictDiscoveryDocumentValidation: false
    });
    this.oAuthService.tokenValidationHandler = new JwksValidationHandler();

    this.oAuthService.setupAutomaticSilentRefresh();

    return this.oAuthService.loadDiscoveryDocumentAndTryLogin({
      onTokenReceived: context => {
        this.authorisedSubject.next(true);

        const returnUrl = context.state;
        if (returnUrl) {
          setTimeout(() => {
            this.router.navigateByUrl(returnUrl);
          }, 200);
        }
      }
    });
  }
}
