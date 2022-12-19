import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApiActionComponent } from './api-action.component';

describe('ApiActionComponent', () => {
  let component: ApiActionComponent;
  let fixture: ComponentFixture<ApiActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ApiActionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
