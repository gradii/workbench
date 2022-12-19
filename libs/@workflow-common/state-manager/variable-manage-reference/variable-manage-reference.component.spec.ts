import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableManageReferenceComponent } from './variable-manage-reference.component';

describe('VariableManageReferenceComponent', () => {
  let component: VariableManageReferenceComponent;
  let fixture: ComponentFixture<VariableManageReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariableManageReferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableManageReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
