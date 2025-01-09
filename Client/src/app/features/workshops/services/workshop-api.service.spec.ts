import { TestBed } from '@angular/core/testing';

import { WorkshopApiService } from './workshop-api.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { WorkshopShort } from '../../../shared/models/WorkshopShort';
import { Tag } from '../../../shared/models/Tag';
import { WorkshopListFiltersFormValue } from '../components/workshop-filters/workshop-filters.component';
import { WorkshopDesc } from '../../../shared/models/WorkshopDesc';
import { Comment } from '../../../shared/models/Comment';
import { WorkshopAddFormValue } from '../../add-forms/add-workshop/add-workshop.component';

describe('WorkshopApiService', () => {
  let service: WorkshopApiService;
  let testingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WorkshopApiService);
    testingController = TestBed.inject(HttpTestingController);
  });
  const url = 'http://localhost:5253/api/workshop';

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get workshops', () => {
    const data: WorkshopShort[] = [
      {
        id: 0,
        name: 'workshop 1',
        location: 'location 1',
        voivodeship: 'voiv 1',
        tags: [],
        rate: 0,
        image: 'img',
        ratesCount: 0,
        isVerified: false,
      },
      {
        id: 1,
        name: 'workshop 2',
        location: 'location 2',
        voivodeship: 'voiv 2',
        tags: [],
        rate: 1,
        image: 'img',
        ratesCount: 1,
        isVerified: true,
      },
    ];

    service.getAllWorkshops().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].name).toBe('workshop 1');
      expect(res[1].isVerified).toBeTrue();
    });
    const req = testingController.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get error', () => {
    const error = { status: 500, statusText: 'Internal Server Error' };

    service.getAllWorkshops().subscribe({
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

    service.getWorkshopsTags().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].name).toBe('tag 1');
      expect(res[1].id).toBe(1);
    });
    const req = testingController.expectOne(`${url}/tags`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get filtered workshops', () => {
    const data: WorkshopShort[] = [
      {
        id: 0,
        name: 'workshop 1',
        location: 'location 1',
        voivodeship: 'voiv 1',
        tags: [],
        rate: 0,
        image: 'img',
        ratesCount: 0,
        isVerified: false,
      },
      {
        id: 1,
        name: 'workshop 2',
        location: 'location 2',
        voivodeship: 'voiv 2',
        tags: [],
        rate: 1,
        image: 'img',
        ratesCount: 1,
        isVerified: true,
      },
    ];
    const filters: WorkshopListFiltersFormValue = {
      searchTerm: '',
      sortBy: 'ASC',
      tags: [],
      voivodeships: [],
    };
    service.getFilteredWorkshops(filters).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].name).toBe('workshop 1');
      expect(res[1].isVerified).toBeTrue();
    });
    const req = testingController.expectOne(
      `${url}/filters?searchTerm=&sortBy=ASC&tags=&voivodeships=`
    );
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get workshop desc', () => {
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

    service.getWorkshopDesc(1).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.name).toBe('Workshop');
      expect(res.description).toBe('description');
    });
    const req = testingController.expectOne(`${url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get workshop comments', () => {
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

  it('should get workshop rate', () => {
    const data = 5;

    service.getWorkshopRate(1).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBe(5);
    });
    const req = testingController.expectOne(`${url}/rate/1`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should post workshop comment', () => {
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

  it('should post workshop', () => {
    const data = 3;
    const form: FormData = new FormData();

    service.addWorkshop(form).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBe(3);
    });
    const req = testingController.expectOne(`${url}`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
  });

  it('should rate workshop', () => {
    const data = 3.5;

    service.rateWorkshop(3, 1).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBe(3.5);
    });
    const req = testingController.expectOne(`${url}/rate`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
  });
});
