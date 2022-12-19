import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeployLogComponent } from './deploy-log.component';

describe('DeployLogComponent', () => {
  let component: DeployLogComponent;
  let fixture: ComponentFixture<DeployLogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
