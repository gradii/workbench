import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { isArray } from '@devops-tools/utils';
import { isNotEmptyObject } from 'class-validator';

@Component({
  selector   : 'dt-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls  : ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  @Input()
  data: any = {};

  // @Input() modalInstance;

  formData = {
    userInfo       : {
      id         : undefined,
      accountName: undefined,
      realName   : undefined
    },
    permissionRoles: []
  };

  options2 = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    // console.log(this.data);
    if (isNotEmptyObject(this.data.userInfo)) {
      this.formData.userInfo = this.data.userInfo;
      this.formData.permissionRoles = this.data.userInfo.permissionRoles.map(it => {
        return {
          name : it.name,
          value: it.roleCode
        };
      });
    }

    this.http.get('/api/system-settings/config-role/role-list', {
      params: {
        pageIndex: String(1),
        pageSize : String(1000)
      }
    })
      .pipe(
        tap((res: any) => {
          console.log(res.rows);
          if (isArray(res.rows)) {
            this.options2 = res.rows.map(it => {
              return {
                name : it.name,
                value: it.roleCode
              };
            });
          }
        })
      )
      .subscribe();
  }

  onSelectObject = (term) => {
    return of(
      this.options2
        .map((option, index) => ({ id: index, option: option }))
        .filter(item => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
    );
  };

  onEditRole() {
    this.http
      .put('/api/system-settings/config-member/member-role', {
        userId         : this.formData.userInfo.id,
        accountName    : this.formData.userInfo.accountName,
        realName       : this.formData.userInfo.realName,
        permissionRoles: this.formData.permissionRoles.map(it => it.value)
      }).pipe(
      // tap(() => {
      //   this.close();
      // }),
      finalize(() => {
        this.handler();
      })
    )
      .subscribe();
  }

  // close() {
  //
  // }
  private handler() {

  }
}
