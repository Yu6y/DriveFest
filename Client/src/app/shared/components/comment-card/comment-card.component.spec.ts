import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCardComponent } from './comment-card.component';
import { Comment } from '../../models/Comment';
import { By } from '@angular/platform-browser';

describe('CommentCardComponent', () => {
  let component: CommentCardComponent;
  let fixture: ComponentFixture<CommentCardComponent>;
  const comment: Comment = {
    id: 0,
    content: 'content',
    timestamp: 'timestamp',
    username: 'username',
    userPic: '',
    userId: 0,
  };
  beforeEach(async () => {
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

  it('should show data', () => {
    component.value = comment;

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.username')).nativeElement.textContent
    ).toBe('username');
    expect(
      fixture.debugElement.query(By.css('.date')).nativeElement.textContent
    ).toBe('timestamp');
    expect(
      fixture.debugElement.query(By.css('.comment')).nativeElement.textContent
    ).toBe('content');
  });
});
