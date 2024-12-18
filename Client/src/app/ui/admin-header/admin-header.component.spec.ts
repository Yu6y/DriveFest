import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHeaderComponent } from './admin-header.component';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';

describe('AdminHeaderComponent', () => {
  let component: AdminHeaderComponent;
  let fixture: ComponentFixture<AdminHeaderComponent>;

  beforeEach(async () => {
    const activatedRoute = {
      snapshot: {
        params: {},
        queryParams: {},
      },
    };
    await TestBed.configureTestingModule({
      imports: [AdminHeaderComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navbar title appear', () => {
    const headerTitle = fixture.debugElement.query(By.css('.navbar-brand'));

    expect(headerTitle.nativeElement.textContent).toBe('DriveFest');
  });

  it('should menu be collapsed', () => {
    expect(component.isCollapsed).toBeTrue();
  });

  it('should button click open header small screen', () => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(768);
    const btn = fixture.debugElement.query(By.css('button'));

    component.isCollapsed = true;
    btn.nativeElement.click();
    fixture.detectChanges();
    expect(component.isCollapsed).toBeFalse();
  });
});
