import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWorkbenchSlotComponent } from './test-workbench-slot.component';

describe('TestWorkbenchSlotComponent', () => {
  let component: TestWorkbenchSlotComponent;
  let fixture: ComponentFixture<TestWorkbenchSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWorkbenchSlotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWorkbenchSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
