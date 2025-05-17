import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LightsService {
  http: HttpClient = inject(HttpClient);
  baseUrl: string = 'http://pi.home:8123/api/states/light.';

  getLightState(deviceId: string) {
    const headers = new HttpHeaders({
      Authorization:
        'Bearer x',
    });
    return this.http.get<{ state: 'on' | 'off' }>(this.baseUrl + deviceId, {
      headers: headers,
    });
  }
}
