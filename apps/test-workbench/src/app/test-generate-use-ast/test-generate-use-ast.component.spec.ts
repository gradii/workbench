import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGenerateUseAstComponent } from './test-generate-use-ast.component';

describe('TestGenerateUseAstComponent', () => {
  let component: TestGenerateUseAstComponent;
  let fixture: ComponentFixture<TestGenerateUseAstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestGenerateUseAstComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestGenerateUseAstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
