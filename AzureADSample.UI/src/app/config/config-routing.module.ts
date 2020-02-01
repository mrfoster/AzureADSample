import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigPageComponent } from './config-page.component';

const routes: Routes = [
  {
    path: 'config',
    component: ConfigPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: []
})
export class ConfigRoutingModule {}
