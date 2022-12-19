import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuffComponentsTreeComponent } from './puff-components-tree.component';

describe('PuffComponentsTreeComponent', () => {
  let component: PuffComponentsTreeComponent;
  let fixture: ComponentFixture<PuffComponentsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuffComponentsTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuffComponentsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
