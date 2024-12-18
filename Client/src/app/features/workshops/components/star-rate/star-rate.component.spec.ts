import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRateComponent } from './star-rate.component';
import { By } from '@angular/platform-browser';

describe('StarRateComponent', () => {
  let component: StarRateComponent;
  let fixture: ComponentFixture<StarRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarRateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StarRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should rate 5', () => {
    component.rating = 0;
    fixture.detectChanges();
    const stars = fixture.debugElement.queryAll(By.css('fa-icon'));
    stars[0].nativeElement.click();
    expect(component.rating).toBe(5);

    stars[4].nativeElement.click();
    expect(component.rating).toBe(1);
  });
});
