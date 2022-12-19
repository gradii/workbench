import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuffStructureTreeComponent } from './puff-structure-tree.component';

describe('PuffStructureTreeComponent', () => {
  let component: PuffStructureTreeComponent;
  let fixture: ComponentFixture<PuffStructureTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuffStructureTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuffStructureTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
