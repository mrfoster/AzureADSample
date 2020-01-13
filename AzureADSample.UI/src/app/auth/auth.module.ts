import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, OAuthModule.forRoot()],
  providers: [AuthService, AuthGuard],
  exports: [OAuthModule]
})
export class AuthModule {}
