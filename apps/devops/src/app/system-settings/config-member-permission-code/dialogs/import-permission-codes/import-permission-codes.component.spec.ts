import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportPermissionCodesComponent } from './import-permission-codes.component';

describe('ImportPermissionCodesComponent', () => {
  let component: ImportPermissionCodesComponent;
  let fixture: ComponentFixture<ImportPermissionCodesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportPermissionCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPermissionCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
