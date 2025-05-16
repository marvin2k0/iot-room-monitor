import { Component, Input } from '@angular/core';
import { UpdateIndicatorComponent } from "../update-indicator/update-indicator.component";

@Component({
  selector: 'app-widget',
  imports: [UpdateIndicatorComponent],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.css',
})
export class WidgetComponent {
  @Input() identifier!: string;
  @Input() value!: string;
}
