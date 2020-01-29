import { Injectable } from '@angular/core';

@Injectable()
export class Config {
  version: string;
  auth: { issuer: string; clientId: string; scope: string };
  baseApiUrl: string;
}
