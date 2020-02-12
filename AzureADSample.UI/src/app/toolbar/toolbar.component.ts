import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  userNameChanged: Observable<string>;

  constructor(
    readonly authService: AuthService,
    private oAuthService: OAuthService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'logo',
      sanitizer.bypassSecurityTrustResourceUrl('logo.svg')
    );
  }

  ngOnInit() {
    this.userNameChanged = this.oAuthService.events.pipe(
      map(() => (this.oAuthService.getIdentityClaims() as any).name),
      distinctUntilChanged()
    );
  }
}
