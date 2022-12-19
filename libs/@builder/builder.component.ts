import {
  ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, ɵmarkDirty
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DragRef, Point, TriDragEnd, TriDragMove, TriDragStart } from '@gradii/triangle/dnd';
import { SidenavComponent, SidenavContainerComponent } from '@gradii/triangle/sidenav';
import { TriTabChangeEvent } from '@gradii/triangle/tabs';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { BuilderSidebarService } from './builder-sidebar.service';
import { IframeFocusService } from './iframe-focus.service';


enum DisplayDrawerType {
  models     = 'Models',
  structure  = 'Structure',
  components = 'Components',
  workflow   = 'Workflow',
  schema     = 'Schema'
}

type DrawerTypeList<T extends keyof typeof DisplayDrawerType = keyof typeof DisplayDrawerType> = {
  name: T,
  icon: string,
  title: (typeof DisplayDrawerType)[T]
};

type ChangedParams = {
  editorTabIdx?: number,
  overviewType?: keyof typeof DisplayDrawerType
};


@Component({
  selector       : 'pf-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation  : ViewEncapsulation.Emulated,
  styleUrls      : ['./builder.component.scss'],
  template       : `
    <div style="display: flex; flex-direction: row; height: 100%;width: 100%">
      <div style="width: 24px;display: flex;flex-direction: column;">
        <div *ngFor="let it of drawerTypeList"
             class="nav-icon-bar"
             [ngClass]="{opened: overviewType===it.name}"
             (click)="toggleDrawer(it.name)">
          <tri-icon [svgIcon]="it.icon"></tri-icon>
          <span class="nav-icon-bar-text">
            {{it.title}}
          </span>
        </div>
      </div>

      <tri-sidenav-container class="sidenav-uu2389" [autosize]="resizing"
                             style="height: 100%;width:100%"
                             [hasBackdrop]="false">
        <tri-sidenav [style.width.px]="sideNavWidth"
                     style="height: calc(100vh - 36px);overflow:visible"
                     #drawer="triSidenav"
                     [mode]="drawerPined?'side':'over'"
                     opened>
          <tri-card style="width: 100%;height: 100%;" [bordered]="false">
            <tri-card-header class="ui-builder-card-header">
              <h5 class="ui-builder-header-title tri-h4">{{displayDrawerHeader}}</h5>
              <tri-card-header-extra>
                <div class="ui-builder-header-right-top-icon">
                  <tri-icon svgIcon="outline:disconnect"
                            (click)="toggleDrawerMode()">>
                  </tri-icon>
                  <tri-icon svgIcon="outline:close" (click)="closeDrawer()"></tri-icon>
                </div>
              </tri-card-header-extra>
            </tri-card-header>

            <!-- no border card body -->
            <puff-page-tree *ngIf="overviewType==='models'"></puff-page-tree>
            <puff-structure-tree *ngIf="overviewType==='structure'"></puff-structure-tree>
            <puff-components-tree *ngIf="overviewType==='components'"></puff-components-tree>
            <puff-workflow-tree *ngIf="overviewType==='workflow'"></puff-workflow-tree>

          </tri-card>

          <div triDrag
               class="tri-drag-indicator"
               [ngClass]="{resizing: resizing}"
               triDragLockAxis="x"
               [triDragConstrainPosition]="onDragConstrainPosition"
               [triDragBoundary]="'.sidenav-uu2389'"
               (triDragStarted)="onDragStart($event)"
               (triDragMoved)="onDragMoved($event)"
               (triDragEnded)="onDragEnd($event)"
          ></div>
        </tri-sidenav>
        <tri-sidenav-content style="height:auto">
          <div class="ui-builder-editor">
            <tri-tab-group class="ui-builder-editor-tab"
                           animationDuration="0"
                           [selectedIndex]="selectedTabIdx"
                           (selectedTabChange)="onSelectedTabChange($event)"
                           style="height: 100%">
              <tri-tab label="page">
                <ng-template triTabContent>
                  <div style="height: 100%;width: 100%;clip-path: inset(0 0 0 0);">
                    <router-outlet></router-outlet>
                  </div>
                </ng-template>
              </tri-tab>
              <tri-tab label="action">
                <ng-template triTabContent>
                  <div style="height: calc(100vh - 70px);width: 100%;">
                    <pf-builder-action></pf-builder-action>
                  </div>
                </ng-template>
              </tri-tab>
              <tri-tab label="audit workflow">
                <ng-template triTabContent>
                  <div style="height: 100%;width: 100%;">
                    sdf
                  </div>
                </ng-template>
              </tri-tab>
              <tri-tab label="page2">
                <ng-template triTabContent>
                  <div style="height: 100%;width: 100%;">
                    <!--                    <kitchen-page2></kitchen-page2>-->
                  </div>
                </ng-template>
              </tri-tab>
            </tri-tab-group>
          </div>
        </tri-sidenav-content>

        <tri-sidenav style="width: 300px; height: calc(100vh - 40px)" position="end" mode="side" opened>
          <pf-action-diagram-inspection *ngIf="selectedTabIdx==1"></pf-action-diagram-inspection>
          <pf-component-inspection *ngIf="selectedTabIdx==0"></pf-component-inspection>
        </tri-sidenav>
      </tri-sidenav-container>
    </div>
  `
})
export class BuilderComponent implements OnInit, OnDestroy {

  drawerPined = true;

  sideNavWidth = 250;

  resizing = false;

  overviewType: keyof typeof DisplayDrawerType = 'models';

  links: string[] = ['a', 'b', 'c'];

  drawerTypeList: DrawerTypeList[] = [
    {
      name : 'models',
      icon : 'outline:home',
      title: DisplayDrawerType.models
    },
    {
      name : 'structure',
      icon : 'outline:menu',
      title: DisplayDrawerType.structure
    },
    {
      name : 'components',
      icon : 'outline:appstore',
      title: DisplayDrawerType.components
    },
    {
      name : 'workflow',
      icon : 'outline:share-alt',
      title: DisplayDrawerType.workflow
    },
    {
      name : 'schema',
      icon : 'outline:code-sandbox',
      title: DisplayDrawerType.schema
    }
  ];


  get displayDrawerHeader() {
    return DisplayDrawerType[this.overviewType];
  }

  @ViewChild(SidenavContainerComponent)
  sidenav: SidenavContainerComponent;

  @ViewChild('drawer', { read: SidenavComponent, static: true })
  drawer: SidenavComponent;

  onDragConstrainPosition: (point: Point, dragRef: DragRef) => Point = (
    point: Point, dragRef: DragRef
  ) => {
    console.log(point);
    if (point.x > 500) {
      point.x = 500;
    }
    if (point.x < 200) {
      point.x = 200;
    }
    return point;
  };

  closeDrawer() {
    this.overviewType = null;
    this.drawer.close();
  }

  toggleDrawer(type: keyof typeof DisplayDrawerType) {
    if (!this.drawer.opened) {
      this.drawer.open();
      this.overviewType = type;
    } else {
      if (this.overviewType === type) {
        this.closeDrawer();
      } else {
        this.overviewType = type;
      }
    }

    this.changeParams({
      overviewType: this.overviewType
    });

  }

  toggleDrawerMode() {
    this.drawerPined = !this.drawerPined;
  }

  _originalX: number;

  onDragStart(event: TriDragStart) {
    this.resizing   = true;
    this._originalX = this.sideNavWidth;
  }

  onDragEnd(event: TriDragEnd) {
    let offset = 0;
    if (event.dropPoint.x > 500) {
      offset = event.dropPoint.x - 500;
    }
    if (event.dropPoint.x < 200) {
      offset = event.dropPoint.x - 200;
    }
    if (event.dropPoint.x < 50) {
      this.drawer.close();
      event.source.reset();
    }
    this.sideNavWidth = this._originalX + event.distance.x - offset;
    this.resizing     = false;
    event.source.reset();
  }

  onDragMoved(event: TriDragMove) {
    this.sideNavWidth = this._originalX + event.distance.x;
    event.source.reset();
  }

  selectedTabIdx: number;

  onSelectedTabChange(event: TriTabChangeEvent) {
    this.selectedTabIdx = event.index;
    this.changeParams({
      editorTabIdx: this.selectedTabIdx
    });
  }

  changeParams(params: ChangedParams) {
    this.router.navigate(['.'], {
      relativeTo         : this.route,
      queryParams        : params,
      queryParamsHandling: 'merge'
    });
  }

  public modelConfig: any;

  onModelConfig(modelData: any) {
    this.modelConfig = modelData;
  }


  sidebarState: Observable<string> = this.builderSidebarService.opened$.pipe(
    map((opened: boolean) => (opened ? 'expanded' : 'collapsed'))
  );

  private destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private builderSidebarService: BuilderSidebarService,
    private iframeFocusService: IframeFocusService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParams as any;
    if (queryParams.editorTabIdx) {
      this.selectedTabIdx = +queryParams.editorTabIdx;
    }
    if (queryParams.overviewType) {
      this.overviewType = queryParams.overviewType;
    }


    this.builderSidebarService.opened$.pipe(takeUntil(this.destroyed$)).subscribe(() => ɵmarkDirty(this));

    this.iframeFocusService.attach();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.iframeFocusService.detach();
  }
}
