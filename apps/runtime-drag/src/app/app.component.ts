import { NgIf } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector   : 'rd-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent {
  title = 'runtime-drag';

  @ViewChildren(NgIf)
  drag: QueryList<ElementRef>;

  ngOnInit() {
    console.log(this.drag);
  }
}
