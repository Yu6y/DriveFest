import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Car } from '../../../../shared/models/Car';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.scss',
})
export class CarCardComponent {
  @Input({ required: true }) value!: Car;
  @Output() iconClick = new EventEmitter<'edit' | 'delete'>();
  @Output() cardClick = new EventEmitter<void>();
}
