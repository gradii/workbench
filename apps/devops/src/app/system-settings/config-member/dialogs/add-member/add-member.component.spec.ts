import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMemberComponent } from './add-member.component';

describe('AddMemberComponent', () => {
  let component: AddMemberComponent;
  let fixture: ComponentFixture<AddMemberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
