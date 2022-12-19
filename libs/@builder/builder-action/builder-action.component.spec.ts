import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderActionComponent } from './builder-action.component';

describe('BuilderActionComponent', () => {
  let component: BuilderActionComponent;
  let fixture: ComponentFixture<BuilderActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuilderActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
