import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) readonly platformId: Object
  ) {}

  load() {
    if (isPlatformServer(this.platformId)) {
      return of<Config>({
        auth: { issuer: '', clientId: '' }
      });
    }

    return this.http.get<Config>('config.json?v=1').pipe(map(c => c as Config));
  }
}
