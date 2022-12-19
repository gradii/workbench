import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AddRoleComponent } from './diglogs/add-role/add-role.component';
import { TriDialogService } from '@gradii/triangle/dialog';

@Component({
  selector   : 'dt-config-permission-role',
  templateUrl: './config-permission-role.component.html',
  styleUrls  : ['./config-permission-role.component.css']
})
export class ConfigPermissionRoleComponent implements OnInit {
  pager: any = {
    pageIndex: 1,
    pageSize : 10,
    total    : 0
  };

  items = [];

  constructor(private http: HttpClient,
              private dialogService: TriDialogService) {
  }

  ngOnInit(): void {
    this.onRefresh();
  }

  onRefresh() {
    this.http.get('/api/system-settings/config-role/role-list', {
      params: {
        pageIndex: this.pager.pageIndex,
        pageSize : this.pager.pageSize,
        orderBy  : 'created_at,desc'
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

  onPageSizeChange($event: number) {
    this.onRefresh();
  }

  onPageIndexChange($event: number) {
    this.onRefresh();
  }


  thisCellEditEnd(event) {
    console.log('cellEditEnd');
    console.log(event.rowItem);
    this.http.put('/api/system-settings/config-role/role-modify', {
      roleId     : event.rowItem.id,
      roleCode   : event.rowItem.roleCode,
      name       : event.rowItem.name,
      description: event.rowItem.description
    }).pipe(
      tap(() => {
        this.onRefresh();
      })
    ).subscribe();
  }

  beforeCellEdit = () => {
    return new Promise<void>((resolve) => {
      console.log('beforeCellEdit');
      resolve();
    });
  };

  onAddRole() {
    const results = this.dialogService.open(AddRoleComponent);
  }

  onRemoveRole(id) {
    if (id > 0) {
      this.http.delete(`/api/system-settings/config-role/role-delete/${id}`).pipe(
        tap(() => {
          this.onRefresh();
        })
      ).subscribe();

    }
  }
}
