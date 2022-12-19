import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayCronComponent } from './play-cron.component';

describe('PlayCronComponent', () => {
  let component: PlayCronComponent;
  let fixture: ComponentFixture<PlayCronComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayCronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayCronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
