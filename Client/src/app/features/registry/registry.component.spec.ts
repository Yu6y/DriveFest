import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryComponent } from './registry.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DateCustomPipe } from '../../shared/pipes/custom-date.pipe';

describe('RegistryComponent', () => {
  let component: RegistryComponent;
  let fixture: ComponentFixture<RegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), DateCustomPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
