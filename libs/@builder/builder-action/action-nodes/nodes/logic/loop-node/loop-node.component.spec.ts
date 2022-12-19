import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoopNodeComponent } from './loop-node.component';

describe('LoopNodeComponent', () => {
  let component: LoopNodeComponent;
  let fixture: ComponentFixture<LoopNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoopNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
