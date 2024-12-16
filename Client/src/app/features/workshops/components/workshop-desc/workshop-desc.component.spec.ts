import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopDescComponent } from './workshop-desc.component';
import { WorkshopStateService } from '../../services/workshop-state.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('WorkshopDescComponent', () => {
  let component: WorkshopDescComponent;
  let fixture: ComponentFixture<WorkshopDescComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('WorkshopStateService', [
      'getWorkshopDesc',
      'getWorkshopRate',
    ]);
    api.getWorkshopRate.and.returnValue(of(1));
    const activatedRouteMock = {
      snapshot: {
        params: { id: '1' },
        queryParams: {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [WorkshopDescComponent],
      providers: [
        { provide: WorkshopStateService, useValue: api },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
