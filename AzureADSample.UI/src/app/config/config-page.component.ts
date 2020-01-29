import { Component, OnInit } from '@angular/core';
import { Config } from './config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-config.page',
  templateUrl: 'config-page.component.html'
})
export class ConfigPageComponent implements OnInit {
  constructor(
    readonly config: Config,
    private readonly httpClient: HttpClient
  ) {}

  apiConfig$: Observable<any>;

  ngOnInit() {
    this.apiConfig$ = this.httpClient.get<any>(
      `${this.config.baseApiUrl}application`
    );
  }
}
