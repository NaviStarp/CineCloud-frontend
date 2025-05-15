import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeEditModalComponent } from './episode-edit-modal.component';

describe('EpisodeEditModalComponent', () => {
  let component: EpisodeEditModalComponent;
  let fixture: ComponentFixture<EpisodeEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpisodeEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
