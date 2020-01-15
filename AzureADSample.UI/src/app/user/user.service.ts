import { Injectable } from '@angular/core';
import { Config } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private readonly config: Config,
    private readonly httpClient: HttpClient
  ) {}

  get() {
    return this.httpClient.get<any>(`${this.config.baseApiUrl}user`);
  }
}
