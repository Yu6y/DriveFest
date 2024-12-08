import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminWorkshop } from '../../../../shared/models/AdminWorkshop';
import { outputTypes } from '../event-list-card/event-list-card.component';

@Component({
  selector: 'app-workshop-list-card',
  standalone: true,
  imports: [],
  templateUrl: './workshop-list-card.component.html',
  styleUrl: './workshop-list-card.component.scss',
})
export class WorkshopListCardComponent {
  @Input({ required: true }) value!: AdminWorkshop;
  @Output() output = new EventEmitter<outputTypes>();
  clicked: boolean = false;

  sendData(type: any, id: number) {
    this.clicked = true;
    this.output.emit({ type, id });
  }
}
