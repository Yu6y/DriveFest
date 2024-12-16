import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCardComponent } from './comment-card.component';
import { Comment } from '../../models/Comment';

describe('CommentCardComponent', () => {
  let component: CommentCardComponent;
  let fixture: ComponentFixture<CommentCardComponent>;

  beforeEach(async () => {
    const comment: Comment = {
      id: 0,
      content: '',
      timestamp: '',
      username: '',
      userPic: '',
      userId: 0,
    };
    await TestBed.configureTestingModule({
      imports: [CommentCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentCardComponent);
    component = fixture.componentInstance;
    component.value = comment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
