import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodePortComponent } from './node-port.component';

describe('NodePortComponent', () => {
  let component: NodePortComponent;
  let fixture: ComponentFixture<NodePortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodePortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodePortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
