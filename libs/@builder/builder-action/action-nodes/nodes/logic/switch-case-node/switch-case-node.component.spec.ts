import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchCaseNodeComponent } from './switch-case-node.component';

describe('SwitchCaseNodeComponent', () => {
  let component: SwitchCaseNodeComponent;
  let fixture: ComponentFixture<SwitchCaseNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchCaseNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchCaseNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
