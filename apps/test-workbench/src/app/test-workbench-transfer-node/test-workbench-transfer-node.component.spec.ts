import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWorkbenchTransferNodeComponent } from './test-workbench-transfer-node.component';

describe('TestWorkbenchTransferNodeComponent', () => {
  let component: TestWorkbenchTransferNodeComponent;
  let fixture: ComponentFixture<TestWorkbenchTransferNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWorkbenchTransferNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWorkbenchTransferNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
