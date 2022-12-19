import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVariableNodeComponent } from './assign-variable-node.component';

describe('AssignVariableNodeComponent', () => {
  let component: AssignVariableNodeComponent;
  let fixture: ComponentFixture<AssignVariableNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignVariableNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVariableNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
