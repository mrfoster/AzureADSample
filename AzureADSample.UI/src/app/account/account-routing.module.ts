import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AccountPageComponent } from './account-page.component';

const routes: Routes = [ {
  path: '',
  canActivate: [AuthGuard],
  component: AccountPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: [],
})
export class AccountRoutingModule { }
