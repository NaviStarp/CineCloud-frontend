import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieFormComponent } from './serie-form.component';

describe('SerieFormComponent', () => {
  let component: SerieFormComponent;
  let fixture: ComponentFixture<SerieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
