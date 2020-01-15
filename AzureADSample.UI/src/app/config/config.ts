import { Injectable } from '@angular/core';

@Injectable()
export class Config {
  auth: { issuer: string; clientId: string; scope: string };
  baseApiUrl: string;
}
