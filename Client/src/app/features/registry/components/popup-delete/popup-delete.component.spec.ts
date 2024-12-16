import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDeleteComponent } from './popup-delete.component';
import { RegistryStateService } from '../../services/registry-state.service';

describe('PopupDeleteComponent', () => {
  let component: PopupDeleteComponent;
  let fixture: ComponentFixture<PopupDeleteComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('RegistryStateService', ['']);
    await TestBed.configureTestingModule({
      imports: [PopupDeleteComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
