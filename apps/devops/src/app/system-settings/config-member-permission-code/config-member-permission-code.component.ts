import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TriNotificationService } from '@gradii/triangle/notification';
import { finalize, tap } from 'rxjs/operators';
import { simpleFadeAnimation } from '@devops-tools/devops/common';
import { ImportPermissionCodesComponent } from './dialogs/import-permission-codes/import-permission-codes.component';
import { TriDialogService } from '@gradii/triangle/dialog';

@Component({
  selector   : 'dt-config-member-permission-code',
  templateUrl: './config-member-permission-code.component.html',
  styleUrls  : ['./config-member-permission-code.component.scss'],
  animations : [simpleFadeAnimation]
})
export class ConfigMemberPermissionCodeComponent implements OnInit {
  permissionRoles: any = [];
  pager                = {
    pageIndex: 1,
    pageSize : 10,
    total    : 0
  };

  dataSource: any[] = [];
  formData: any     = {
    permissionCode       : '',
    permissionDescription: ''
  };


  constructor(
    private readonly http: HttpClient,
    private readonly nbDialogService: TriDialogService,
    private readonly nbToastrService: TriNotificationService
  ) {
  }

  ngOnInit(): void {
    this.refresh();
  }

  onToggle(permissionCode, roleCode, toStatus) {
    // console.log(permissionCode, roleCode, toStatus);


    this.http.post(`/api/system-settings/config-permission/config-permission-role-code`, {
      permissionCode,
      roleCode,
      action: toStatus
    }).pipe(
      finalize(() => {
        this.refresh();
      })
    )
      .subscribe();

  }

  refresh(data = {}) {
    this.http.get('/api/system-settings/config-permission/permission-code-list', {
      params: {
        pageIndex: String(this.pager.pageIndex),
        pageSize : String(this.pager.pageSize),
        ...this.formData
      }
    })
      .pipe(
        tap((res: any) => {
          console.log(res);

          this.permissionRoles = res.permissionRoles;
          this.dataSource      = res.rows;
          this.pager.total     = res.count;
        })
      )
      .subscribe();
  }

  onImportPermissionCodes() {
    this.nbDialogService.open(ImportPermissionCodesComponent);
    // const results = this.nbDialogService.open({
    //   title  : '导入权限码',
    //   width  : '600px',
    //   content: ImportPermissionCodesComponent,
    //   buttons: [
    //     {
    //       cssClass: 'primary',
    //       text    : '确定',
    //       handler : ($event: Event) => {
    //         try {
    //           const codes = JSON.parse(results.modalContentInstance.formData.permissionCodesDescription);
    //           this.http.post('/api/system-settings/config-permission/permission-code-import', {
    //             permissionCodes: codes
    //           }).pipe(
    //             tap(() => {
    //               this.refresh()
    //               results.modalInstance.hide();
    //             })
    //           ).subscribe();
    //
    //         } catch (e) {
    //           this.nbToastrService.danger('请输入正确的json文本');
    //         }
    //
    //       }
    //     }
    //   ]
    // });
  }

  onSearch() {
    this.refresh();
  }
}
