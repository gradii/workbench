import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericNodeComponent } from './numeric-node.component';

describe('NumericNodeComponent', () => {
  let component: NumericNodeComponent;
  let fixture: ComponentFixture<NumericNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumericNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
