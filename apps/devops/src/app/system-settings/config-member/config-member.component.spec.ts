import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigMemberComponent } from './config-member.component';

describe('ConfigMemberComponent', () => {
  let component: ConfigMemberComponent;
  let fixture: ComponentFixture<ConfigMemberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigMemberComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
