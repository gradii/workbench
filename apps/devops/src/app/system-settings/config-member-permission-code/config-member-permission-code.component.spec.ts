import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigMemberPermissionCodeComponent } from './config-member-permission-code.component';

describe('ConfigMemberPermissionCodeComponent', () => {
  let component: ConfigMemberPermissionCodeComponent;
  let fixture: ComponentFixture<ConfigMemberPermissionCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigMemberPermissionCodeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMemberPermissionCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
