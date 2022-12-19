import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TriDialogRef } from '@gradii/triangle/dialog';
import { tap } from 'rxjs/operators';

@Component({
  selector   : 'dt-add-member',
  templateUrl: './add-member.component.html',
  styleUrls  : ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  formData = {
    accountName    : '',
    realName       : '',
    password       : '',
    confirmPassword: ''
  };

  constructor(
    private http: HttpClient,
    private dialogRef: TriDialogRef<any>) {
  }

  onSave() {
    const formData = this.formData;
    console.log(formData);
    this.http.post('/api/auth/register', {
      accountName: formData.accountName,
      realName   : formData.realName,
      password   : formData.password,
      repassword : formData.confirmPassword,
      mobile     : 0
    }).pipe(
      tap(() => {
        this.dialogRef.close(this.formData);
      })
    ).subscribe();

  }

  ngOnInit(): void {
  }

}
