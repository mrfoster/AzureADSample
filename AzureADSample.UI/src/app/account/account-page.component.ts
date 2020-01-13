import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-account-page',
  templateUrl: 'account-page.component.html'
})

export class AccountPageComponent implements OnInit {

  claims: object;

  constructor(private oauthService: OAuthService) { }

  ngOnInit() {
    this.claims = this.oauthService.getIdentityClaims();
  }
}
