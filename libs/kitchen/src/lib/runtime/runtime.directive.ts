import { Directive, ElementRef, Inject, Input, OnInit, Optional, SkipSelf } from '@angular/core';

@Directive({
  selector: '[_kitchenRuntime]'
})
export class RuntimeDirective implements OnInit {
  @Input('_kitchenRuntimeComponentId')
  componentId: string;

  @Input('_kitchenRuntimeDefinitionId')
  definitionId: string;

  constructor(
    // @Host() public container: ɵTriDropContainer,
    public elementRef: ElementRef,
    @Optional() @SkipSelf() @Inject(RuntimeDirective)
    public parent: RuntimeDirective
  ) {
  }

  ngOnInit() {
    // console.log(this.componentId);
  }
}