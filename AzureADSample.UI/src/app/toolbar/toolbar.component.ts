import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  userNameChanged: Observable<string>;

  constructor(
    readonly authService: AuthService,
    private userService: UserService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'logo',
      sanitizer.bypassSecurityTrustResourceUrl('logo.svg')
    );
  }

  ngOnInit() {
    this.userNameChanged = this.authService.authenticated.pipe(
      flatMap(() => this.userService.get()),
      map(user => (user ? user.name : null))
    );
  }
}
