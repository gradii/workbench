import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injectable,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { ViewDefinitionsService } from './view-definitions.service';
import { COMPONENT_DEFINITION, Definition } from './definition';

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
  selector: 'oven-definitions',
  template: '<ng-template></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StandardLibDefinitionService]
})
export class DefinitionsComponent implements AfterViewInit {
  @ViewChild(TemplateRef, { read: ViewContainerRef }) host: ViewContainerRef;

  constructor(
    private definitionsService: ViewDefinitionsService,
    private standardLibDefinitionsService: StandardLibDefinitionService
  ) {
  }

  ngAfterViewInit() {
    this.definitionsService.attach(this.host);
    this.standardLibDefinitionsService.defineStandardLib();
  }
}
