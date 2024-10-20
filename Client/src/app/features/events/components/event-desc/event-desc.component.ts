import { Component, Input } from '@angular/core';
import { EventDesc } from '../../../../shared/models/EventDesc';
import { MatIconModule } from '@angular/material/icon';
import { CommentsListComponent } from '../../../../shared/components/comments-list/comments-list.component';

@Component({
  selector: 'app-event-desc',
  standalone: true,
  imports: [MatIconModule, CommentsListComponent],
  templateUrl: './event-desc.component.html',
  styleUrl: './event-desc.component.scss',
})
export class EventDescComponent {
  event!: EventDesc;
}
