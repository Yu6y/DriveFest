import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupRegistryFormComponent } from './popup-registry-form.component';
import { RegistryStateService } from '../../services/registry-state.service';

describe('PopupRegistryFormComponent', () => {
  let component: PopupRegistryFormComponent;
  let fixture: ComponentFixture<PopupRegistryFormComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('RegistryStateService', ['']);
    await TestBed.configureTestingModule({
      imports: [PopupRegistryFormComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupRegistryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
