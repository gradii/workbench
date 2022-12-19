import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SampleApiLogComponent } from './sample-api-log.component';

describe('SampleApiLogComponent', () => {
  let component: SampleApiLogComponent;
  let fixture: ComponentFixture<SampleApiLogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SampleApiLogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleApiLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
