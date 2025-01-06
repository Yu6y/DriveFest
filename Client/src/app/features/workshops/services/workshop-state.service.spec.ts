import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { WorkshopStateService } from './workshop-state.service';
import { WorkshopApiService } from './workshop-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { WorkshopShort } from '../../../shared/models/WorkshopShort';
import { Observable, of, throwError } from 'rxjs';
import { Comment } from '../../../shared/models/Comment';
import { Tag } from '../../../shared/models/Tag';
import { WorkshopListFiltersFormValue } from '../components/workshop-filters/workshop-filters.component';
import { WorkshopDesc } from '../../../shared/models/WorkshopDesc';

describe('WorkshopStateService', () => {
  let service: WorkshopStateService;
  let api: jasmine.SpyObj<any>;
  beforeEach(() => {
    api = jasmine.createSpyObj('WorkshopsApiService', [
      'getAllWorkshops',
      'getComments',
      'getWorkshopsTags',
      'getFilteredWorkshops',
      'getWorkshopDesc',
      'postComment',
      'rateWorkshop',
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
        location: 'Location 1',
        voivodeship: 'Voiv 1',
        tags: [],
        rate: 5,
        image: 'img 1',
        ratesCount: 2,
        isVerified: true,
      },
      {
        id: 2,
        name: 'Workshop 2',
        location: 'Location 2',
        voivodeship: 'Voiv 2',
        tags: [],
        rate: 4,
        image: 'img 2',
        ratesCount: 3,
        isVerified: true,
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
        expect(result.data[1].isVerified).toBeTrue();
      }
    });
  }));

  it('should return tags', fakeAsync(() => {
    const data: Tag[] = [
      {
        id: 0,
        name: 'tag 1',
      },
      {
        id: 1,
        name: 'tag 2',
      },
      {
        id: 2,
        name: 'tag 3',
      },
    ];

    api.getWorkshopsTags.and.returnValue(of(data));

    const apiData = service.getTags();

    tick(200);

    apiData.subscribe((result) => {
      expect(result).toEqual(data);
      expect(result.length).toBe(3);
      expect(result[2].name).toBe('tag 3');
    });
  }));

  it('should load filtered workshops', fakeAsync(() => {
    const data: WorkshopShort[] = [
      {
        id: 1,
        name: 'Workshop',
        location: 'Location 1',
        voivodeship: 'Voiv',
        tags: [],
        rate: 5,
        image: 'img 1',
        ratesCount: 2,
        isVerified: true,
      },
      {
        id: 2,
        name: 'Workshop',
        location: 'Location 2',
        voivodeship: 'Voiv',
        tags: [],
        rate: 4,
        image: 'img 2',
        ratesCount: 3,
        isVerified: true,
      },
      {
        id: 3,
        name: 'Event 3',
        location: 'Location 2',
        voivodeship: 'Voiv 2',
        tags: [],
        rate: 4,
        image: 'img 2',
        ratesCount: 3,
        isVerified: true,
      },
    ];

    const filters: WorkshopListFiltersFormValue = {
      searchTerm: 'Workshop',
      sortBy: 'NONE',
      tags: [],
      voivodeships: ['Voiv'],
    };

    api.getFilteredWorkshops.and.returnValue(
      of(data.filter((x) => x.name === 'Workshop' && x.voivodeship === 'Voiv'))
    );

    service.loadFilteredWorkshops(filters);

    tick(200);

    service.workshopsList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data).toEqual(data.slice(0, 2));
        expect(result.data.length).toBe(2);
        expect(result.data[1].image).toBe('img 2');
      }
    });
  }));

  it('should load workshop description', fakeAsync(() => {
    const data: WorkshopDesc = {
      id: 1,
      name: 'Workshop',
      location: 'Location 1',
      voivodeship: 'Voiv',
      tags: [],
      rate: 5,
      image: 'img 1',
      ratesCount: 2,
      isVerified: true,
      address: 'address',
      description: 'description',
      workshopDescId: 0,
    };

    api.getWorkshopDesc.and.returnValue(of(data));

    service.getWorkshopDesc(0);

    tick(200);

    service.workshopDesc$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data).toEqual(data);
        expect(result.data.address).toBe('address');
        expect(result.data.location).toBe('Location 1');
      }
    });
  }));

  it('should load comments list', fakeAsync(() => {
    const data: Comment[] = [
      {
        id: 0,
        content: 'con 1',
        timestamp: 'timestamp',
        username: 'user1',
        userPic: 'pic',
        userId: 1,
      },
      {
        id: 1,
        content: 'con 2',
        timestamp: 'timestamp',
        username: 'user2',
        userPic: 'pic',
        userId: 3,
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

  it('should add comment', fakeAsync(() => {
    const comment: Comment = {
      id: 1,
      content: 'comment',
      timestamp: 'timestamp',
      username: 'username',
      userPic: 'pic',
      userId: 0,
    };

    api.getComments.and.returnValue(of([]));
    service.loadComments(0);

    tick(200);

    api.postComment.and.returnValue(of(comment));
    service.addComment(0, 'comment').subscribe();

    tick(200);

    service.commentsList$.subscribe((result) => {
      console.log(result);
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data).toEqual([comment]);
        expect(result.data.length).toBe(1);
        expect(result.data[0].content).toBe('comment');
      }
    });
  }));

  it('should rate workshop', fakeAsync(() => {
    const data: WorkshopDesc = {
      id: 1,
      name: 'Workshop',
      location: 'Location 1',
      voivodeship: 'Voiv',
      tags: [],
      rate: 0,
      image: 'img 1',
      ratesCount: 0,
      isVerified: true,
      address: 'address',
      description: 'description',
      workshopDescId: 0,
    };

    api.getWorkshopDesc.and.returnValue(of(data));
    service.getWorkshopDesc(0);

    tick(200);

    api.rateWorkshop.and.returnValue(of(5));
    service.rateWorkshop(5, false);

    tick(200);

    service.workshopDesc$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data.rate).toBe(5);
        expect(result.data.ratesCount).toBe(1);
      }
    });
  }));
});
