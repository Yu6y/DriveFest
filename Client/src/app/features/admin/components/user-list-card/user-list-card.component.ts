import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserData } from '../../../../shared/models/UserData';
import { outputTypes } from '../event-list-card/event-list-card.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-list-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './user-list-card.component.html',
  styleUrl: './user-list-card.component.scss',
})
export class UserListCardComponent {
  @Input({ required: true }) value!: UserData;
  @Output() output = new EventEmitter<outputTypes>();
  clicked: boolean = false;

  sendData(type: any, id: number) {
    this.clicked = true;
    this.output.emit({ type, id });
  }
}
