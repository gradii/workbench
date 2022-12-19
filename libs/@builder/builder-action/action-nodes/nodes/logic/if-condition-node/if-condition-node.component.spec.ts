import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfConditionNodeComponent } from './if-condition-node.component';

describe('IfConditionNodeComponent', () => {
  let component: IfConditionNodeComponent;
  let fixture: ComponentFixture<IfConditionNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfConditionNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfConditionNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
