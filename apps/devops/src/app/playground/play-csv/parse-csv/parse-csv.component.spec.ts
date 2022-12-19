import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParseCsvComponent } from './parse-csv.component';

describe('ParseCsvComponent', () => {
  let component: ParseCsvComponent;
  let fixture: ComponentFixture<ParseCsvComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ParseCsvComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParseCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
