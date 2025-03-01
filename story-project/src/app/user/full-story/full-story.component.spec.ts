import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullStoryComponent } from './full-story.component';

describe('FullStoryComponent', () => {
  let component: FullStoryComponent;
  let fixture: ComponentFixture<FullStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullStoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
