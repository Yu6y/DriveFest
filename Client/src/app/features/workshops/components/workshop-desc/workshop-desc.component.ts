import { Component, inject, Input, runInInjectionContext } from '@angular/core';
import { CommentsListComponent } from '../../../../shared/components/comments-list/comments-list.component';
import { MatIcon } from '@angular/material/icon';
import { WorkshopDesc } from '../../../../shared/models/WorkshopDesc';
import { WorkshopStateService } from '../../services/workshop-state.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Tag } from '../../../../shared/models/Tag';
import { Observable } from 'rxjs';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-workshop-desc',
  standalone: true,
  imports: [CommentsListComponent, MatIcon, AsyncPipe],
  templateUrl: './workshop-desc.component.html',
  styleUrl: './workshop-desc.component.scss',
})
export class WorkshopDescComponent {
  private stateService = inject(WorkshopStateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  workshop$!: Observable<LoadingState<WorkshopDesc>>;

  ngOnInit() {
    this.stateService.getWorkshopDesc(+this.route.snapshot.params['id']);
    this.workshop$ = this.stateService.workshopDesc$;
  }

  makeTags(tags: Tag[]) {
    let tagsDesc: string[] = tags.map((tag) => tag.name);
    return tagsDesc.join(', ');
  }
}
