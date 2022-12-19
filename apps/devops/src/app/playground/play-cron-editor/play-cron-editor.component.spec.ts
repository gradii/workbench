import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayCronEditorComponent } from './play-cron-editor.component';

describe('PlayCronEditorComponent', () => {
  let component: PlayCronEditorComponent;
  let fixture: ComponentFixture<PlayCronEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayCronEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayCronEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
