import { Component, inject } from '@angular/core';
import { WidgetComponent } from './components/widget/widget.component';
import { MetricsService } from './services/metrics.service';

@Component({
  selector: 'app-root',
  imports: [WidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  metricsService: MetricsService = inject(MetricsService);

  temperature!: number;
  humidity!: number;

  yesterdayTemperature!: number;
  yesterdayHumidity!: number;

  ngOnInit() {
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
