import { Component, OnInit, Optional } from '@angular/core';
import { TriDialogRef } from '@gradii/triangle/dialog';

@Component({
  selector   : 'dt-add-role',
  templateUrl: './add-role.component.html',
  styleUrls  : ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  val: 'hello world';

  formData: any = {
    roleCode   : '',
    name       : '',
    description: ''
  };

  constructor(
    @Optional() protected dialogRef: TriDialogRef<AddRoleComponent>
  ) {
  }

  ngOnInit(): void {
    console.log(this.val);
  }


  cancel() {
    this.dialogRef.close();
  }

  submit(name) {
    this.dialogRef.close(name);
  }

}
