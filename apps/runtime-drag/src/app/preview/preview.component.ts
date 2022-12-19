import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, NgModuleRef, OnInit,
  RendererFactory2, ViewChild, ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import { KitchenSlot } from '@common';
import { moveItemInArray } from '@gradii/triangle/dnd';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { tap } from 'rxjs/operators';
import { CodeGenVisitor } from './code-gen-visitor';
import { Definitions } from './definitions';
import { getComponentHelper } from './get-component.helper';
import { RuntimeDragPreviewService } from './runtime-drag-preview.service';
import { Slots } from './slots';

@Component({
  selector     : 'rd-preview',
  templateUrl  : './preview.component.html',
  styleUrls    : ['./preview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers    : [RuntimeDragPreviewService]
})
export class PreviewComponent implements OnInit {
  componentRef: ComponentRef<any>;

  val: boolean;

  @ViewChild('host', { read: ElementRef, static: true })
  host: ElementRef;

  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true })
  viewContainerRef: ViewContainerRef;

  constructor(
    private stateConverterService: StateConverterService,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private ngModuleRef: NgModuleRef<any>,
    private rendererFactory2: RendererFactory2,
    private runtimeDragPreviewService: RuntimeDragPreviewService
  ) {
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    // const data = this.stateConverterService.testConvertPage('1', Definitions, Slots);
    //
    // console.log(data);
    // this.outputComponent(data);
  }

  getComponent(template: string) {
    const { Component } = getComponentHelper(template);
    return Component;
  }

  createComponent(template: string, type: string) {
    const Comp = this.getComponent(template);
    // setScopeOnDeclaredComponents(ButtonModule, Comp);

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    const factory: ComponentFactory<any> =
            this.resolver.resolveComponentFactory(Comp);


    this.componentRef = factory.create(
      this.injector,
      undefined,
      undefined
    );

    // @ts-ignore
    this.componentRef.instance.text = type;
    this.componentRef.instance.slotChange.pipe(
      tap((transferData: any) => {
        console.log(transferData);
        if (transferData.transferArrayItem) {
          const { item, current, target, targetIndex } = transferData.transferArrayItem;

          const componentDefinition = Definitions.find(it => it.id == item.id);
          const spaceSlot           = Slots.find(it => it.parentComponentId == target.id);
          if (componentDefinition && spaceSlot) {
            const targetList = Definitions.filter(it => it.parentSlotId === spaceSlot.id).sort(
              (a, b) => a.index - b.index);
            targetList.splice(targetIndex, 0, componentDefinition);
            targetList.forEach((it, index) => {
              it.index = index;
            });
            componentDefinition.parentSlotId = spaceSlot.id;
          }

          this.init();
        } else if (transferData.moveInArrayItem) {
          const { item, current, currentIndex, targetIndex } = transferData.moveInArrayItem;

          const componentDefinition = Definitions.find(it => it.id == item.id);
          const spaceSlot           = Slots.find(it => it.parentComponentId == current.id); // only one slot
          if (componentDefinition && spaceSlot) {
            const targetList = Definitions.filter(it => it.parentSlotId === spaceSlot.id).sort(
              (a, b) => a.index - b.index);
            moveItemInArray(targetList, currentIndex, targetIndex);
            targetList.forEach((it, index) => {
              it.index = index;
            });
          }

          this.init();
        }
      })
    ).subscribe();
    this.componentRef.changeDetectorRef.detectChanges();
    this.viewContainerRef.insert(this.componentRef.hostView);
    // });
  }

  outputComponent(data: { content: KitchenSlot }) {
    const visitor = new CodeGenVisitor();
    const slot    = data.content;
    visitor.visit(slot);

    const output = visitor.flush();
    console.log(output);
    this.createComponent(
      '<div triDropContainerGroup>' + output + '</div>',
      'success'
    );
  }

}

