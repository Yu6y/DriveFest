import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearListComponent } from './linear-list.component';

describe('EventsListComponent', () => {
  let component: LinearListComponent;
  let fixture: ComponentFixture<LinearListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinearListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinearListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
