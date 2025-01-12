import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { EventStateService } from './event-state.service';
import { EventApiService } from './event-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { EventShort } from '../../../shared/models/EventShort';
import { of } from 'rxjs';
import { EventDesc } from '../../../shared/models/EventDesc';
import { Comment } from '../../../shared/models/Comment';
import { Tag } from '../../../shared/models/Tag';
import { EventListFiltersFormValue } from '../components/event-filters/event-filters.component';

describe('EventStateService', () => {
  let service: EventStateService;
  let api: jasmine.SpyObj<any>;
  beforeEach(() => {
    api = jasmine.createSpyObj('EventApiService', [
      'getAllEvents',
      'getEventDesc',
      'getComments',
      'postComment',
      'followEvent',
      'unFollowEvent',
      'getFavoriteEvents',
      'getTags',
      'getEventsFiltered',
    ]);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: EventApiService,
          useValue: api,
        },
        DateCustomPipe,
      ],
    });
    service = TestBed.inject(EventStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load events', fakeAsync(() => {
    const data: EventShort[] = [
      {
        id: 0,
        name: 'event 1',
        location: 'location 1',
        voivodeship: 'voiv 1',
        tags: [],
        date: '2020-12-12',
        image: 'img',
        followersCount: 0,
        isVerified: false,
        isFavorite: false,
      },
      {
        id: 1,
        name: 'event 2',
        location: 'location 2',
        voivodeship: 'voiv 2',
        tags: [],
        date: '2020-12-12',
        image: 'img',
        followersCount: 0,
        isVerified: false,
        isFavorite: true,
      },
    ];

    api.getAllEvents.and.returnValue(of(data));
    service.loadEvents();

    tick(200);

    service.eventsList$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') {
        expect(res.data).toEqual(data);
        expect(res.data.length).toBe(2);
        expect(res.data[1].isVerified).toBeFalse();
      }
    });
  }));

  it('should get event desc', fakeAsync(() => {
    const data: EventDesc = {
      id: 1,
      name: 'event 2',
      location: 'location 2',
      voivodeship: 'voiv 2',
      tags: [],
      date: '2020-12-12',
      image: 'img',
      followersCount: 0,
      isVerified: false,
      isFavorite: true,
      address: 'address',
      description: 'desc',
      eventDescId: 1,
    };

    api.getEventDesc.and.returnValue(of(data));
    service.getEventDesc(1);

    tick(200);

    service.eventDesc$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data).toEqual(data);
        expect(result.data.address).toBe('address');
        expect(result.data.location).toBe('location 2');
      }
    });
  }));

  it('should load comments', fakeAsync(() => {
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

  it('should follow event', fakeAsync(() => {
    const data: EventShort[] = [
      {
        id: 0,
        name: 'event 1',
        location: 'location 1',
        voivodeship: 'voiv 1',
        tags: [],
        date: '2020-12-12',
        image: 'img',
        followersCount: 0,
        isVerified: false,
        isFavorite: false,
      },
      {
        id: 1,
        name: 'event 2',
        location: 'location 2',
        voivodeship: 'voiv 2',
        tags: [],
        date: '2020-12-12',
        image: 'img',
        followersCount: 0,
        isVerified: false,
        isFavorite: false,
      },
    ];

    api.getAllEvents.and.returnValue(of(data));
    api.followEvent.and.returnValue(of({}));
    service.loadEvents();
    tick(2000);

    service.handleEventFollow(0, '').subscribe();
    tick(2000);

    service.eventsList$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') {
        expect(res.data.length).toBe(2);
        expect(res.data[0].isFavorite).toBeTrue();
        expect(res.data[0].followersCount).toBe(1);
      }
    });
  }));

  it('should follow event in  description', fakeAsync(() => {
    const data: EventDesc = {
      id: 1,
      name: 'event 2',
      location: 'location 2',
      voivodeship: 'voiv 2',
      tags: [],
      date: '2020-12-12',
      image: 'img',
      followersCount: 1,
      isVerified: false,
      isFavorite: true,
      address: 'address',
      description: 'desc',
      eventDescId: 1,
    };

    api.getEventDesc.and.returnValue(of(data));
    service.getEventDesc(1);

    api.followEvent.and.returnValue(of({}));
    api.unFollowEvent.and.returnValue(of({}));

    service.handleEventDescFollow(0).subscribe();
    tick(2000);

    service.eventDesc$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') {
        expect(res.data.isFavorite).toBeFalse();
        expect(res.data.followersCount).toBe(0);
      }
    });
  }));

  it('should load favorties events', fakeAsync(() => {
    const data: EventShort[] = [
      {
        id: 0,
        name: 'event 1',
        location: 'location 1',
        voivodeship: 'voiv 1',
        tags: [],
        date: '2020-12-12',
        image: 'img',
        followersCount: 0,
        isVerified: false,
        isFavorite: true,
      },
      {
        id: 1,
        name: 'event 2',
        location: 'location 2',
        voivodeship: 'voiv 2',
        tags: [],
        date: '2020-12-12',
        image: 'img',
        followersCount: 0,
        isVerified: false,
        isFavorite: true,
      },
    ];

    api.getFavoriteEvents.and.returnValue(of(data));
    service.loadFavEvents();

    tick(200);

    service.eventsList$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') {
        expect(res.data).toEqual(data);
        expect(res.data.length).toBe(2);
        expect(res.data[0].isFavorite).toBeTrue();
        expect(res.data[0].isFavorite).toBeTrue();
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

    api.getTags.and.returnValue(of(data));

    const apiData = service.getTags();

    tick(200);

    apiData.subscribe((result) => {
      expect(result).toEqual(data);
      expect(result.length).toBe(3);
      expect(result[2].name).toBe('tag 3');
    });
  }));

  it('should load filtered events', fakeAsync(() => {
    const data: EventShort[] = [
      {
        id: 0,
        name: 'event 1',
        location: 'location 1',
        voivodeship: 'voiv 1',
        tags: [],
        date: '2020-12-12',
        image: 'img',
        followersCount: 0,
        isVerified: false,
        isFavorite: true,
      },
      {
        id: 1,
        name: 'event 2',
        location: 'location 2',
        voivodeship: 'voiv 2',
        tags: [],
        date: '2020-12-12',
        image: 'img',
        followersCount: 0,
        isVerified: false,
        isFavorite: true,
      },
    ];

    const filters: EventListFiltersFormValue = {
      searchTerm: 'event',
      dateFrom: '2020-10-10',
      dateTo: '2020-12-12',
      sortBy: 'NONE',
      tags: [],
      voivodeships: ['voiv 1'],
    };

    api.getEventsFiltered.and.returnValue(
      of(data.filter((x) => x.name === 'event 1' && x.voivodeship === 'voiv 1'))
    );

    service.loadFilteredEvents(filters);

    tick(200);

    service.eventsList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data).toEqual(data.slice(0, 1));
        expect(result.data.length).toBe(1);
        expect(result.data[0].name).toBe('event 1');
      }
    });
  }));
});
