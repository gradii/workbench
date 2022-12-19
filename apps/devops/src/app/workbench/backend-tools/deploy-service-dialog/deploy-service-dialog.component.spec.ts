import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeployServiceDialogComponent } from './deploy-service-dialog.component';

describe('DeployServiceDialogComponent', () => {
  let component: DeployServiceDialogComponent;
  let fixture: ComponentFixture<DeployServiceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployServiceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
