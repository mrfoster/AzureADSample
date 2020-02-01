import { Injectable } from '@angular/core';

@Injectable()
export class Config {
  version: string;
  auth: { issuer: string; clientId: string; apiScope: string };
  baseApiUrl: string;
}
