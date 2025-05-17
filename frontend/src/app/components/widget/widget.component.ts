import { Component, Input } from '@angular/core';
import { UpdateIndicatorComponent } from '../update-indicator/update-indicator.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-widget',
  imports: [UpdateIndicatorComponent, DecimalPipe],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.css',
})
export class WidgetComponent {
  @Input() identifier!: string;
  @Input() value!: number;
  @Input() compare!: number;
  @Input() unit!: string;
  @Input() desired!: 'higher' | 'lower';
}
