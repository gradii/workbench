import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWorkflowComponent } from './test-workflow.component';

describe('TestWorkflowComponent', () => {
  let component: TestWorkflowComponent;
  let fixture: ComponentFixture<TestWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWorkflowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
