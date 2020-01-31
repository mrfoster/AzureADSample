import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DashboardPageComponent } from './dashboard/dashboard-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardPageComponent,
    NotFoundPageComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ConfigModule,
    AppRoutingModule,
    AuthModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
