import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonNodeComponent } from './common-node.component';

describe('CommonNodeComponent', () => {
  let component: CommonNodeComponent;
  let fixture: ComponentFixture<CommonNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
