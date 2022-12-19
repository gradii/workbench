import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { AccordionComponent } from '@gradii/triangle/accordion';

@Directive({ selector: '[pfAccordionController]' })
export class AccordionControllerDirective implements OnDestroy, AfterViewInit {

  constructor(private accordion: AccordionComponent) {
    accordion.size = 'small';
    accordion.bordered = false;
    accordion.defaultExpanded = true;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

}
