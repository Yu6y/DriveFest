import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { WorkshopShort } from '../../../../shared/models/WorkshopShort';

@Component({
  selector: 'app-workshop-card',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './workshop-card.component.html',
  styleUrl: './workshop-card.component.scss',
})
export class WorkshopCardComponent {
  @Input({ required: true }) workshop!: WorkshopShort;
  @Output() cardClick = new EventEmitter<void>();
  tags: string = '#';

  ngOnInit() {
    this.workshop.tags.forEach((x) => (this.tags = this.tags + ', ' + x.name));
  }
}
