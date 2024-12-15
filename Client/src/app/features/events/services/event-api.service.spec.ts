import { TestBed } from '@angular/core/testing';

import { EventApiService } from './event-api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EventApiService', () => {
  let service: EventApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EventApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
