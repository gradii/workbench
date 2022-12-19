import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuffPageTreeComponent } from './puff-page-tree.component';

describe('PuffPageTreeComponent', () => {
  let component: PuffPageTreeComponent;
  let fixture: ComponentFixture<PuffPageTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuffPageTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuffPageTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
