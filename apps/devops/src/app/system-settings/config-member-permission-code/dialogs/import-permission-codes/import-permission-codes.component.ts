import { Component, OnInit } from '@angular/core';

@Component({
  selector   : 'dt-import-permission-codes',
  templateUrl: './import-permission-codes.component.html',
  styleUrls  : ['./import-permission-codes.component.css']
})
export class ImportPermissionCodesComponent implements OnInit {
  formData: any = {
    permissionCodesDescription: ''
  };
  placeholder: any = `
[
  {
    "permissionCode": "R_SYSTEM_SETTINGS",
    "description": ""
  },
  {
    "permissionCode": "R_API_SYSTEM_SETTINGS_MEMBER_LIST",
    "description": ""
  },
  {
    "permissionCode": "R_API_SYSTEM_SETTINGS_MEMBER_ROLE",
    "description": ""
  },
]
  `;

  constructor() {
  }

  ngOnInit(): void {
  }

}
