import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerConfigComponent } from './server-config.component';

describe('ServerConfigComponent', () => {
  let component: ServerConfigComponent;
  let fixture: ComponentFixture<ServerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
