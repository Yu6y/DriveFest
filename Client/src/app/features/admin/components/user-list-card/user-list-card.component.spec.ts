import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListCardComponent } from './user-list-card.component';
import { UserData } from '../../../../shared/models/UserData';

describe('UserListCardComponent', () => {
  let component: UserListCardComponent;
  let fixture: ComponentFixture<UserListCardComponent>;

  beforeEach(async () => {
    const data: UserData = {
      id: 0,
      username: '',
      email: '',
      createdAt: '',
      isAdmin: false,
    };
    await TestBed.configureTestingModule({
      imports: [UserListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListCardComponent);
    component = fixture.componentInstance;

    component.value = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
