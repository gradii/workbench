import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunActionNodeComponent } from './run-action-node.component';

describe('RunActionNodeComponent', () => {
  let component: RunActionNodeComponent;
  let fixture: ComponentFixture<RunActionNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunActionNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunActionNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
