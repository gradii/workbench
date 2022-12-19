import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpGetNodeComponent } from './http-get-node.component';

describe('HttpGetNodeComponent', () => {
  let component: HttpGetNodeComponent;
  let fixture: ComponentFixture<HttpGetNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpGetNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpGetNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
