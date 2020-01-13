import { NgModule } from '@angular/core';

import { AccountPageComponent } from './account-page.component';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  imports: [CommonModule, AccountRoutingModule],
  exports: [],
  declarations: [AccountPageComponent],
  providers: [],
})
export class AccountModule { }
