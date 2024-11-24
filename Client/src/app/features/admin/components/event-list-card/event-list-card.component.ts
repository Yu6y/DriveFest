import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminEvent } from '../../../../shared/models/AdminEvent';

export type outputTypes = {
  type: 'delete' | 'edit' | 'accept' | 'event';
  id: number;
};
@Component({
  selector: 'app-event-list-card',
  standalone: true,
  imports: [],
  templateUrl: './event-list-card.component.html',
  styleUrl: './event-list-card.component.scss',
})
export class EventListCardComponent {
  @Input({ required: true }) value!: AdminEvent;
  @Output() output = new EventEmitter<outputTypes>();
  clicked: boolean = false;

  sendData(type: any, id: number) {
    this.clicked = true;
    this.output.emit({ type, id });
  }
}
