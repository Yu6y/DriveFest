import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Car } from '../../../../shared/models/Car';
import { PopupService } from '../../../../shared/services/popup.service';
import { POPUP_TYPE } from '../../../../shared/models/PopupType';

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
}
