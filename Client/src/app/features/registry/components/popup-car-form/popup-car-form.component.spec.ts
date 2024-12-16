import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCarFormComponent } from './popup-car-form.component';
import { RegistryStateService } from '../../services/registry-state.service';

describe('PopupCarFormComponent', () => {
  let component: PopupCarFormComponent;
  let fixture: ComponentFixture<PopupCarFormComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj("RegistryService", ['cos']);
    await TestBed.configureTestingModule({
      imports: [PopupCarFormComponent],
      providers: [{
        provide: RegistryStateService,
        useValue: api
      }]
    })
    .compileComponents();

    

    fixture = TestBed.createComponent(PopupCarFormComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
