import { TestBed } from '@angular/core/testing';

import { StoryContentService } from './story-content.service';

describe('StoryContentService', () => {
  let service: StoryContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoryContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
