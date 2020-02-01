import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Config } from './config';
import { ConfigPageComponent } from './config-page.component';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigService } from './config.service';

let config: Config;

export function initConfig(configService: ConfigService) {
  return () =>
    configService
      .load()
      .toPromise()
      .then(c => {
        config = c;
      });
}

@NgModule({
  imports: [CommonModule, ConfigRoutingModule],

  exports: [],
  declarations: [ConfigPageComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: Config,
      useFactory: () => {
        return config;
      }
    }
  ]
})
export class ConfigModule {}
