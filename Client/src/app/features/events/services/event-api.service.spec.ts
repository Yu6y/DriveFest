import { TestBed } from '@angular/core/testing';

import { EventApiService } from './event-api.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { EventShort } from '../../../shared/models/EventShort';
import { EventDesc } from '../../../shared/models/EventDesc';
import { EventListFiltersFormValue } from '../components/event-filters/event-filters.component';
import { Comment } from '../../../shared/models/Comment';
import { Tag } from '../../../shared/models/Tag';

describe('EventApiService', () => {
  let service: EventApiService;
  let testingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EventApiService);
    testingController = TestBed.inject(HttpTestingController);
  });

  const url = 'http://localhost:5253/api/event';

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get error', () => {
    const error = { status: 500, statusText: 'Internal Server Error' };

    service.getAllEvents().subscribe({
      next: () => fail("Shouldn't appear"),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      },
    });

    const req = testingController.expectOne(`${url}`);
    expect(req.request.method).toBe('GET');

    req.flush(null, error);
  });

  it('should get events', () => {
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

    service.getAllEvents().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].name).toBe('event 1');
      expect(res[1].isVerified).toBeFalse();
    });
    const req = testingController.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get event desc', () => {
    const data: EventDesc = {
      id: 1,
      name: 'event',
      image: '',
      date: '2024-04-11',
      location: 'location',
      followersCount: 0,
      voivodeship: 'voiv',
      tags: [],
      isFavorite: false,
      isVerified: false,
      address: 'address',
      description: 'desc',
      eventDescId: 0,
    };

    service.getEventDesc(1).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.name).toBe('event');
      expect(res.description).toBe('desc');
    });

    const req = testingController.expectOne(`${url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get filtered events', () => {
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

    const filters: EventListFiltersFormValue = {
      searchTerm: '',
      sortBy: 'ASC',
      dateFrom: '',
      dateTo: '',
      tags: [],
      voivodeships: [],
    };

    service.getEventsFiltered(filters).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].name).toBe('event 1');
      expect(res[1].isVerified).toBeFalse();
    });
    const req = testingController.expectOne(
      `${url}/filters?searchTerm=&sortBy=ASC&dateFrom=&dateTo=&tags=&voivodeships=`
    );
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get event comments', () => {
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

    service.getComments(1).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].content).toBe('con 1');
      expect(res[1].userId).toBe(3);
    });
    const req = testingController.expectOne(`${url}/1/comments`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should post event comment', () => {
    const data: Comment = {
      id: 0,
      content: 'content',
      timestamp: 'timestamp',
      username: 'username',
      userPic: '',
      userId: 1,
    };
    const comm = 'content';

    service.postComment(1, comm).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.content).toBe(comm);
    });
    const req = testingController.expectOne(`${url}/1/comments`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
  });

  it('should unfollow event', () => {
    const data = 1;

    service.unFollowEvent(data).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBe(data);
    });
    const req = testingController.expectOne(`${url}/favorites/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(data);
  });

  it('should follow event', () => {
    const data = 1;

    service.followEvent(data).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBe(data);
    });
    const req = testingController.expectOne(`${url}/favorites`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
  });

  it('should get favorites events', () => {
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

    service.getFavoriteEvents().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].name).toBe('event 1');
      expect(res[1].isVerified).toBeFalse();
    });
    const req = testingController.expectOne(`${url}/favorites`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get workshops tags', () => {
    const data: Tag[] = [
      {
        id: 0,
        name: 'tag 1',
      },
      {
        id: 1,
        name: 'tag 2',
      },
    ];

    service.getTags().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].name).toBe('tag 1');
      expect(res[1].id).toBe(1);
    });
    const req = testingController.expectOne(`${url}/tags`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should post workshop', () => {
    const data = 3;
    const form: FormData = new FormData();

    service.addEvent(form).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBe(3);
    });
    const req = testingController.expectOne(`${url}`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
  });
});
