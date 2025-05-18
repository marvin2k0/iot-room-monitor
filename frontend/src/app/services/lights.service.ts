import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LightsService {
  http: HttpClient = inject(HttpClient);
  baseUrl: string = 'http://web.home:8080/lamps/';

  getLightState(deviceId: string) {
    return this.http.get<{ state: 'on' | 'off' }>(this.baseUrl + deviceId);
  }
}
