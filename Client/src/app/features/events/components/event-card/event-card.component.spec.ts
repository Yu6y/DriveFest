import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardComponent } from './event-card.component';
import { Tag } from '../../../../shared/models/Tag';
import { By } from '@angular/platform-browser';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;

    component.event = {
      id: 1,
      name: 'event',
      image: '',
      date: '2024-04-11',
      location: 'location',
      followersCount: 0,
      voivodeship: 'voiv',
      tags: [],
      isFavorite: false,
      isVerified: false,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data', () => {
    const elem = fixture.debugElement;

    expect(elem.query(By.css('.p-name')).nativeElement.textContent).toBe(
      'event'
    );
    expect(elem.query(By.css('.follow-text')).nativeElement.textContent).toBe(
      'Followers: 0'
    );
    expect(
      elem.queryAll(By.css('.desc-text'))[0].nativeElement.textContent
    ).toBe('2024-04-11');
  });
});
