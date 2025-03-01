import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStoryComponent } from './my-story.component';

describe('MyStoryComponent', () => {
  let component: MyStoryComponent;
  let fixture: ComponentFixture<MyStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyStoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
