import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { isArray } from '@devops-tools/utils';
import { TriDialogService } from '@gradii/triangle/dialog';
import { tap } from 'rxjs/operators';
import { AddMemberComponent } from './dialogs/add-member/add-member.component';
import { EditRoleComponent } from './dialogs/edit-role/edit-role.component';

@Component({
  selector: 'dt-config-member',
  templateUrl: './config-member.component.html',
  styleUrls: ['./config-member.component.css']
})
export class ConfigMemberComponent implements OnInit {
  pager: any = {
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };

  items = [];


  constructor(
    private http: HttpClient,
    private dialogService: TriDialogService
  ) {
  }

  ngOnInit(): void {
    this.onRefresh();
  }

  onRefresh() {
    this.http.get('/api/system-settings/config-member/member-list', {
      params: {
        pageIndex: this.pager.pageIndex,
        pageSize: this.pager.pageSize
      }
    })
      .pipe(
        tap((data: any) => {
          console.log(data);
          this.items = data.rows;
          this.pager.total = data.count;
        })
      )
      .subscribe();
  }

  formatPermissionRoles(cellValue) {
    if (isArray(cellValue)) {
      return cellValue.map(it => it.name).join(', ');
    }
    return '';
  }

  thisCellEditEnd(event) {
    console.log('cellEditEnd');
    console.log(event.rowItem);
  }

  beforeCellEdit = () => {
    return new Promise<void>((resolve) => {
      console.log('beforeCellEdit');
      resolve();
    });
  };

  finishEdit() {

  }

  onEditRole(rowItem) {
    // console.log(rowItem);

    const results = this.dialogService.open(EditRoleComponent/*{
      width    : '600px',
      component: EditRoleComponent,

      data   : {
        userInfo: rowItem
      },
      handler: () => {
        results.modalInstance.hide();
        this.onRefresh();
      }
    }*/);
  }

  onAddMember() {
   this.dialogService.open(AddMemberComponent).afterClosed().pipe(
      tap((formData) => {
        if(formData) {
          this.onRefresh();
        }
      })
    ).subscribe();

  }
}
