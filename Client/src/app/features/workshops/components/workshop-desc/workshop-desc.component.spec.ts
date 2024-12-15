import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopDescComponent } from './workshop-desc.component';
import { WorkshopStateService } from '../../services/workshop-state.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('WorkshopDescComponent', () => {
  let component: WorkshopDescComponent;
  let fixture: ComponentFixture<WorkshopDescComponent>;
  let workshopStateServiceSpy: jasmine.SpyObj<WorkshopStateService>;

  beforeEach(async () => {
    workshopStateServiceSpy = jasmine.createSpyObj('WorkshopStateService', {
      getWorkshopDesc: null,
      getWorkshopRate: null,
      workshopDesc$: null
    });

    const activatedRouteMock = {
      snapshot: {
        params: { id: '1' },
        queryParams: {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [WorkshopDescComponent],
      providers: [
        { provide: WorkshopStateService, useValue: workshopStateServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
