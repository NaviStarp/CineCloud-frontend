import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCarouselComponent } from './media-carousel.component';

describe('MediaCarouselComponent', () => {
  let component: MediaCarouselComponent;
  let fixture: ComponentFixture<MediaCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
