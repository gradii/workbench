import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserFacade } from '@auth/user-facade.service';
import { PermissionCode } from '@devops-tools/api-interfaces';
import { isArray } from '@devops-tools/utils';
import { difference } from 'ramda';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AppComponent } from './app.component';

@Component({
  selector   : 'dt-app-sidebar',
  templateUrl: './app.sidebar.component.html'
})
export class AppSideBarComponent implements OnInit, OnDestroy {

  menu = [];

  private permissionCodes: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(public app: AppComponent, private userFacade: UserFacade) {
    this.userFacade.permissionCodes$.pipe(
      takeUntil(this.destroy$),
      tap((permissionCodes: string[]) => {
        this.permissionCodes = permissionCodes;
        this.rebuildMenu();
      })
    ).subscribe();
  }

  checkPermission(alterPermissionCodes) {
    if (alterPermissionCodes.length === 0) {
      return true;
    }
    const diffResult = difference(alterPermissionCodes, this.permissionCodes);
    return diffResult.length < alterPermissionCodes.length;

  }

  rebuildMenu() {
    const menu = [
      //########################################################################探测工具
      {
        title         : '可视化开发',
        needPermission: [PermissionCode.R_V1, PermissionCode.API_V1_DIAGNOSIS],
        children      : [
          // {
          //   title         : 'API工具',
          //   link          : '/v1/api-diagnosis',
          //   linkType      : 'routerLink',
          //   needPermission: [PermissionCode.R_V1, PermissionCode.API_V1_DIAGNOSIS]
          // },
          {
            title         : '项目列表',
            link          : '/workbench/projects',
            linkType      : 'routerLink',
            needPermission: [PermissionCode.R_V1, PermissionCode.API_V1_DIAGNOSIS]
          },
          {
            title   : '组件库开发',
            link    : '',
            linkType: 'href',
            children: [
              {
                title   : '数据库设计',
                link    : '',
                linkType: 'href'
              },
              {
                title   : '设计稿查看',
                link    : '',
                linkType: 'href'
              },
              {
                title   : '图标库管理',
                link    : '',
                linkType: 'href'
              }
            ]
          }
        ]
      },
      //########################################################################开发工具
      {
        title         : '开发工具',
        needPermission: [PermissionCode.R_V1, PermissionCode.R_PLAYGROUND],
        children      : [
          {
            title   : 'csv 工具',
            link    : '/playground/play-csv/parse-csv',
            linkType: 'routerLink',
            // children: [
            //   { title: 'csv 工具', link: 'csv' }
            // ]
            needPermission: [PermissionCode.R_V1, PermissionCode.R_PLAYGROUND_PLAY_CSV]
          },
          {
            title         : 'PLAY DATA TABLE',
            link          : '/playground/play-data-table/demo-column',
            linkType      : 'routerLink',
            needPermission: [PermissionCode.R_V1, PermissionCode.R_PLAYGROUND_PLAY_DATA_TABLE]
          },
          {
            title         : 'JSON 编辑器',
            link          : '/playground/play-json/json-editor',
            linkType      : 'routerLink',
            needPermission: [PermissionCode.R_V1, PermissionCode.R_PLAYGROUND_PLAY_JSON]
          },
          {
            title         : 'API 工具',
            link          : '/playground/play-api/api-action',
            linkType      : 'routerLink',
            needPermission: [PermissionCode.R_V1, PermissionCode.R_PLAYGROUND_PLAY_API, PermissionCode.R_PLAYGROUND_PLAY_API_ACTION]
          },
          {
            title         : 'API WORKFLOW',
            link          : '/playground/play-api/api-workflow',
            linkType      : 'routerLink',
            needPermission: [PermissionCode.R_V1, PermissionCode.R_PLAYGROUND_PLAY_API, PermissionCode.R_PLAYGROUND_PLAY_API_WORKFLOW]
          }
        ]
      },
      //########################################################################系统设置
      {
        title         : '系统设置',
        needPermission: [PermissionCode.R_SYSTEM_SETTINGS],
        children      : [
          {
            title         : '用户配置',
            link          : '/system-settings/config-member',
            linkType      : 'routerLink',
            needPermission: [PermissionCode.R_SYSTEM_SETTINGS, PermissionCode.R_SYSTEM_SETTINGS_CONFIG_MEMBER]
          },
          {
            title         : '权限码配置',
            link          : '/system-settings/config-member-permission-code',
            linkType      : 'routerLink',
            needPermission: [PermissionCode.R_SYSTEM_SETTINGS, PermissionCode.R_SYSTEM_SETTINGS_CONFIG_MEMBER_PERMISSION_CODE]
          },
          {
            title         : '权限角色配置',
            link          : '/system-settings/config-permission-role',
            linkType      : 'routerLink',
            needPermission: [PermissionCode.R_SYSTEM_SETTINGS, PermissionCode.R_SYSTEM_SETTINGS_CONFIG_PERMISSION_ROLE]
          }
        ]
      }
    ];

    this.menu = this.handleMenuPermission(menu);
  }

  private handleMenuPermission(menu) {
    return menu.filter(it => {
      let show = true;

      if (it.needPermission && isArray(it.needPermission)) {
        show = this.checkPermission(it.needPermission);
        if (show) {
          return true;
        } else {
          if (it.children && isArray(it.children)) {
            it.children = this.handleMenuPermission(it.children);
          }
          if (isArray(it.children) && it.children.length > 0) {
            show = true;
          }
        }
      }

      return show;
    });
  }

  ngOnInit() {
    this.rebuildMenu();
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
