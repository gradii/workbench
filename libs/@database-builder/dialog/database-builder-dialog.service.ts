import { Injectable } from '@angular/core';
import { TriDialogService } from '@gradii/triangle/dialog';
import { DatabaseManageComponent } from '../database-manage/database-manage.component';

@Injectable()
export class DatabaseBuilderDialogService {
  constructor(private dialogService: TriDialogService) {
  }

  open() {
    this.dialogService.open(DatabaseManageComponent);
  }
}