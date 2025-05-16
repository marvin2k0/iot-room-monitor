import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MetricsResponse } from '../model/MetricsResponse';

@Injectable({
  providedIn: 'root',
})
export class MetricsService {
  http: HttpClient = inject(HttpClient);

  baseUrl = 'http://web.home:8080';

  getMetrics() {
    return this.http.get<MetricsResponse>(`${this.baseUrl}/current`);
  }
}
