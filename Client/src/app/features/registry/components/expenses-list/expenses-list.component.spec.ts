import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesListComponent } from './expenses-list.component';
import { RegistryStateService } from '../../services/registry-state.service';

describe('ExpensesListComponent', () => {
  let component: ExpensesListComponent;
  let fixture: ComponentFixture<ExpensesListComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('RegistryStateService', {
      prepareReg: null,
    });
    await TestBed.configureTestingModule({
      imports: [ExpensesListComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
