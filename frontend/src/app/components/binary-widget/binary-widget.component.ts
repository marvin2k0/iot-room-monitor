import { Component, inject, Input } from '@angular/core';
import { UpdateIndicatorComponent } from '../update-indicator/update-indicator.component';
import { LightsService } from '../../services/lights.service';

@Component({
  selector: 'app-binary-widget',
  imports: [UpdateIndicatorComponent],
  templateUrl: './binary-widget.component.html',
  styleUrl: './binary-widget.component.css',
})
export class BinaryWidgetComponent {
  lightService: LightsService = inject(LightsService);

  @Input() identifier!: string;
  @Input() haName!: string;
  status!: boolean;

  ngOnInit() {
    this.updateLightState();
    setInterval(() => {
      this.updateLightState();
    }, 5e3);
  }

  updateLightState() {
    this.lightService.getLightState(this.haName).subscribe((data) => {
      console.log(data);
      this.status = data.state === 'on';
    });
  }
}
