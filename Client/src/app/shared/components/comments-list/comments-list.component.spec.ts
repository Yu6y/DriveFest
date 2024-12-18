import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsListComponent } from './comments-list.component';
import { EventStateService } from '../../../features/events/services/event-state.service';
import { WorkshopStateService } from '../../../features/workshops/services/workshop-state.service';
import { Comment } from '../../models/Comment';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('CommentsListComponent', () => {
  let component: CommentsListComponent;
  let fixture: ComponentFixture<CommentsListComponent>;
  const data: Comment = {
    id: 0,
    content: '',
    timestamp: '',
    username: '',
    userPic: '',
    userId: 0,
  };
  beforeEach(async () => {
    let eventApi = jasmine.createSpyObj('EventStateService', ['']);
    let workshopApi = jasmine.createSpyObj('WorkshopStateService', {
      loadComments: null,
    });
    await TestBed.configureTestingModule({
      imports: [CommentsListComponent],
      providers: [
        {
          provide: EventStateService,
          useValue: eventApi,
        },
        {
          provide: WorkshopStateService,
          useValue: workshopApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 2 items', () => {
    component.comments$ = of({ state: 'success', data: [data, data] });

    fixture.detectChanges();

    const commentCards = fixture.debugElement.queryAll(
      By.css('app-comment-card')
    );
    expect(commentCards.length).toBe(2);
  });

  it('should display text while empty list', () => {
    component.comments$ = of({
      state: 'success',
      data: [],
    });

    fixture.detectChanges();

    const emptyText = fixture.debugElement.query(By.css('p'));
    expect(emptyText.nativeElement.textContent).toBe('Brak komentarzy.');
  });

  it('should display loading indicator', () => {
    component.comments$ = of({
      state: 'loading',
    });

    fixture.detectChanges();

    const indicator = fixture.debugElement.query(By.css('dx-load-indicator'));
    expect(indicator).toBeTruthy();
  });

  it('should display error message', () => {
    component.comments$ = of({
      state: 'error',
      error: 'Wystąpił błąd!',
    });

    fixture.detectChanges();

    const text = fixture.debugElement.query(By.css('p'));
    expect(text.nativeElement.textContent).toContain('Wystąpił błąd!');
  });
});
