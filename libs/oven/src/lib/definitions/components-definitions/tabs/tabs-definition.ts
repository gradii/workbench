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
import { NbTabComponent, NbTabsetComponent } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, Slot, SlotDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { UIDataService } from '../../definition-utils/ui-data.service';

type TabsDefinitionContext = DefinitionContext<NbTabsetComponent>;

@Directive({ selector: '[ovenTabSlot]' })
export class TabSlotDirective extends SlotDirective {
  @Input() slotId: string;
}

@Directive({ selector: '[ovenTabsDefinition]' })
export class TabsDefinitionDirective implements AfterViewInit, OnDestroy {
  @ContentChildren(TabSlotDirective) tabsContent: QueryList<SlotDirective>;

  private destroyed: Subject<void> = new Subject<void>();
  private context;

  @Input('ovenTabsDefinition') set view(context: TabsDefinitionContext) {
    this.context = context;

    context.view = {
      instance: this.tabs,
      slots: {},
      element: this.element,
      updateDynamicSlots: () => {
        context.view.slots = this.tabsContent.reduce((slots: { [key: string]: Slot }, item: TabSlotDirective) => {
          slots[item.slotId] = item;
          return slots;
        }, {});
      }
    };

    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      if (eventType === 'tabsChangeTab') {
        const subscription = this.tabs.changeTab.subscribe((tab: NbTabComponent) => {
          const tabs = this.tabs.tabs.toArray();
          const selectedIndex = tabs.findIndex(t => t === tab);
          callback({ selectedIndex, length: tabs.length });
        });
        return () => subscription.unsubscribe();
      }
    });

    this.tabs.changeTab.pipe(takeUntil(this.destroyed)).subscribe(data => {
      const options = (this.tabs as any).options;
      const selectedIndex: number = options.findIndex(option => option.value === data.tabTitle);
      this.uiDataService.updateUIVariable((this.context.view.instance as any).name, 'selectedIndex', selectedIndex);
    });
  }

  constructor(
    public tabs: NbTabsetComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective,
    private uiDataService: UIDataService
  ) {
  }

  ngAfterViewInit(): void {
    this.tabs.tabs.changes.pipe(takeUntil(this.destroyed)).subscribe(res => {
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
  selector: 'oven-tabs-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-tabset
      fullWidth
      cdkScrollable
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenTabsDefinition]="context"
    >
      <nb-tab
        ovenTabSlot
        *ngFor="let tab of context.view?.instance.options; trackBy: trackTab"
        [ovenWithPaddings]="context.view?.instance.paddings"
        [slotId]="tab.id"
        [tabTitle]="tab.value"
      >
        <ng-template ovenSlotPlaceholder></ng-template>
      </nb-tab>
    </nb-tabset>
  `
})
export class TabsDefinitionComponent implements ComponentDefinition<TabsDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<TabsDefinitionContext>;

  trackTab(index, tab) {
    return tab.id;
  }
}
