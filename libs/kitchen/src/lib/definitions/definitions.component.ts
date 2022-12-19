import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Injectable, TemplateRef, ViewChild,
  ViewContainerRef
} from '@angular/core';
import { COMPONENT_DEFINITION, Definition } from './definition';

import { ViewDefinitionsService } from './view-definitions.service';

@Injectable()
export class StandardLibDefinitionService {
  constructor(
    @Inject(COMPONENT_DEFINITION) private definitions: Definition[],
    private viewDefinitionsService: ViewDefinitionsService
  ) {
  }

  defineStandardLib() {
    this.viewDefinitionsService.defineAll(this.definitions);
  }
}

@Component({
  selector       : 'puff-definitions',
  template       : '<ng-template></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers      : [StandardLibDefinitionService]
})
export class DefinitionsComponent implements AfterViewInit {
  @ViewChild(TemplateRef, { read: ViewContainerRef }) host: ViewContainerRef;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private definitionsService: ViewDefinitionsService,
    private standardLibDefinitionsService: StandardLibDefinitionService
  ) {
  }

  ngAfterViewInit() {
    this.definitionsService.attach(this.host);
    this.standardLibDefinitionsService.defineStandardLib();

    // this._elementRef.nativeElement.remove();
  }
}
