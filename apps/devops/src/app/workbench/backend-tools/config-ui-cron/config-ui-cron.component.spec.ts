import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigUiCronComponent } from './config-ui-cron.component';

describe('ConfigUiCronComponent', () => {
  let component: ConfigUiCronComponent;
  let fixture: ComponentFixture<ConfigUiCronComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigUiCronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUiCronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
