import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardPageComponent } from './dashboard/dashboard-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: {
      meta: {
        title: 'Page Not Found'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
