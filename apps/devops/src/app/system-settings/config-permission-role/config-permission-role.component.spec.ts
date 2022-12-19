import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigPermissionRoleComponent } from './config-permission-role.component';

describe('ConfigPermissionRoleComponent', () => {
  let component: ConfigPermissionRoleComponent;
  let fixture: ComponentFixture<ConfigPermissionRoleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigPermissionRoleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPermissionRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
