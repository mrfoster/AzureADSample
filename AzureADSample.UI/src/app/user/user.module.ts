import { NgModule } from '@angular/core';

import { UserPageComponent } from './user-page.component';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [CommonModule, UserRoutingModule],
  exports: [],
  declarations: [UserPageComponent],
  providers: [],
})
export class UserModule { }
