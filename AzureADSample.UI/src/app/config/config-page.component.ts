import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from './config';

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
