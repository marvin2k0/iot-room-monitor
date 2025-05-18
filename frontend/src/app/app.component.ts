import { Component, inject } from '@angular/core';
import { WidgetComponent } from './components/widget/widget.component';
import { MetricsService } from './services/metrics.service';
import { LightsService } from './services/lights.service';
import { BinaryWidgetComponent } from "./components/binary-widget/binary-widget.component";

@Component({
  selector: 'app-root',
  imports: [WidgetComponent, BinaryWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  metricsService: MetricsService = inject(MetricsService);
  lightsService: LightsService = inject(LightsService);

  temperature!: number;
  humidity!: number;

  yesterdayTemperature!: number;
  yesterdayHumidity!: number;

  ngOnInit() {
    this.lightsService
      .getLightState('nachttisch_lightbulb')
      .subscribe((data) => {
        console.log(data.state);
      });

    this.readMetrics();
    setInterval(() => this.readMetrics(), 1000 * 60);
  }

  readMetrics() {
    this.metricsService.getMetrics().subscribe((data) => {
      this.temperature = data.temperature;
      this.humidity = data.humidity;
    });

    this.metricsService.getYesterdaysMetrics().subscribe((data) => {
      this.yesterdayTemperature = data.temperature;
      this.yesterdayHumidity = data.humidity;
    });
  }
}
