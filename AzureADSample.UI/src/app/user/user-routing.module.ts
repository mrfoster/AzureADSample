import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { UserPageComponent } from './user-page.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: UserPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: []
})
export class UserRoutingModule {}
