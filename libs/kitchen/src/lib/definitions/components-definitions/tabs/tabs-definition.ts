import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild
} from '@angular/core';
import { TriTabChangeEvent, TriTabGroup } from '@gradii/triangle/tabs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, Slot, SlotDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { UIDataService } from '../../definition-utils/ui-data.service';

type TabsDefinitionContext = DefinitionContext<TriTabGroup>;

@Directive({ selector: '[kitchenTabSlot]' })
export class TabSlotDirective extends SlotDirective {
  @Input() slotId: string;
}

@Directive({ selector: '[kitchenTabsDefinition]' })
export class TabsDefinitionDirective implements AfterViewInit, OnDestroy {
  @ContentChildren(TabSlotDirective) tabsContent: QueryList<SlotDirective>;

  private destroyed: Subject<void> = new Subject<void>();
  private context;

  @Input('kitchenTabsDefinition') set view(context: TabsDefinitionContext) {
    this.context = context;

    context.view = {
      instance          : this.tabGroup,
      slots             : {},
      element           : this.element,
      updateDynamicSlots: () => {
        context.view.slots = this.tabsContent.reduce((slots: { [key: string]: Slot }, item: TabSlotDirective) => {
          slots[item.slotId] = item;
          return slots;
        }, {});
      }
    };

    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      if (eventType === 'tabsChangeTab') {
        const subscription = this.tabGroup.selectedTabChange.subscribe((changeEvent: TriTabChangeEvent) => {
          callback({ selectedIndex: changeEvent.index, length: this.tabGroup._tabs.length });
        });
        return () => subscription.unsubscribe();
      }
    });

    this.tabGroup.selectedTabChange.pipe(takeUntil(this.destroyed)).subscribe(data => {
      const options               = (this.tabGroup as any).options;
      const selectedIndex: number = options.findIndex(option => option.value === data.tab.title);
      this.uiDataService.updateUIVariable((this.context.view.instance as any).name, 'selectedIndex', selectedIndex);
    });
  }

  constructor(
    public tabGroup: TriTabGroup,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective,
    private uiDataService: UIDataService
  ) {
  }

  ngAfterViewInit(): void {
    this.tabGroup._tabs.changes.pipe(takeUntil(this.destroyed)).subscribe(res => {
      // set timeout prevents state update inside of component.service.bake method
      setTimeout(() => {
        this.uiDataService.updateUIVariable((this.context.view.instance as any).name, 'length', res.length);
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }
}

@Component({
  selector       : 'kitchen-tabs-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-tab-group
      fullWidth
      cdkScrollable
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenTabsDefinition]="context"
    >
      <tri-tab
        kitchenTabSlot
        *ngFor="let tab of context.view?.instance.options; trackBy: trackTab"
        [kitchenWithPaddings]="context.view?.instance.paddings"
        [slotId]="tab.id"
        [title]="tab.value"
      >
        <ng-template kitchenSlotPlaceholder></ng-template>
      </tri-tab>
    </tri-tab-group>
  `
})
export class TabsDefinitionComponent implements ComponentDefinition<TabsDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<TabsDefinitionContext>;

  trackTab(index, tab) {
    return tab.id;
  }
}
