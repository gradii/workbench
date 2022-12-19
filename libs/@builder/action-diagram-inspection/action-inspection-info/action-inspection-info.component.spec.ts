import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionInspectionInfoComponent } from './action-inspection-info.component';

describe('ActionInspectionInfoComponent', () => {
  let component: ActionInspectionInfoComponent;
  let fixture: ComponentFixture<ActionInspectionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionInspectionInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionInspectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
