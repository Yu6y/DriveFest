import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { WorkshopStateService } from './workshop-state.service';
import { WorkshopApiService } from './workshop-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { WorkshopShort } from '../../../shared/models/WorkshopShort';
import { of } from 'rxjs';
import { APP_ID } from '@angular/core';
import { Comment } from '../../../shared/models/Comment';

describe('WorkshopStateService', () => {
  let service: WorkshopStateService;
  let api: jasmine.SpyObj<any>;
  beforeEach(() => {
    api = jasmine.createSpyObj('WorkshopsApiService', [
      'getAllWorkshops',
      'getComments',
    ]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: WorkshopApiService,
          useValue: api,
        },
        DateCustomPipe,
      ],
    });
    service = TestBed.inject(WorkshopStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set workshops list', fakeAsync(() => {
    const data: WorkshopShort[] = [
      {
        id: 1,
        name: 'Workshop 1',
        location: '',
        voivodeship: '',
        tags: [],
        rate: 5,
        image: '',
        ratesCount: 2,
        isVerified: true,
      },
      {
        id: 2,
        name: 'Workshop 2',
        location: '',
        voivodeship: '',
        tags: [],
        rate: 4,
        image: '',
        ratesCount: 3,
        isVerified: false,
      },
    ];

    api.getAllWorkshops.and.returnValue(of(data));

    service.loadWorkshops();

    tick(200);

    service.workshopsList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data).toEqual(data);
        expect(result.data.length).toBe(2);
      }
    });
  }));

  it('should load comments list', fakeAsync(() => {
    const data: Comment[] = [
      {
        id: 0,
        content: '',
        timestamp: '',
        username: '',
        userPic: '',
        userId: 0,
      },
      {
        id: 0,
        content: '',
        timestamp: '',
        username: '',
        userPic: '',
        userId: 0,
      },
    ];

    api.getComments.and.returnValue(of(data));

    service.loadComments(3);

    tick(200);

    service.commentsList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data).toEqual(data);
        expect(result.data.length).toBe(2);
      }
    });
  }));
});
