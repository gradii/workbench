import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCycleNodeComponent } from './life-cycle-node.component';

describe('LifeCycleNodeComponent', () => {
  let component: LifeCycleNodeComponent;
  let fixture: ComponentFixture<LifeCycleNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeCycleNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCycleNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
