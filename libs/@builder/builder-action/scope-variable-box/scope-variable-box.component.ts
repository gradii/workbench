import { Component } from '@angular/core';
import { StoreItem } from '@common/public-api';
import { Observable } from 'rxjs';
import { StoreItemUtilService } from '@workflow-common/util/store-item-util.service';

@Component({
  selector : 'pf-scope-variable-box',
  template : `
    <div class="scope-variable-box">
      <div *ngFor="let it of filteredStoreItemList$ | async">
        <div>
          <tri-tag color="green">S</tri-tag>
          <tri-tag color="green">{{it.valueType}}</tri-tag>
          {{it.name}} {{it.value}}
        </div>
      </div>
      <div *ngFor="let it of globalStoreItemList$ | async">
        <div>
          <tri-tag color="green">G</tri-tag>
          <tri-tag color="green">{{it.valueType}}</tri-tag>
          {{it.name}} {{it.value}}
        </div>
      </div>
      <form>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <tri-checkbox triPrefix></tri-checkbox>
          <input size="small" triInput placeholder="Simple placeholder" value="newVariable" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <tri-checkbox triPrefix></tri-checkbox>
          <input size="small" triInput placeholder="Simple placeholder" value="newVariable1" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <tri-checkbox triPrefix></tri-checkbox>
          <input size="small" triInput placeholder="Simple placeholder" value="newVariable2" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <tri-checkbox triPrefix></tri-checkbox>
          <input size="small" triInput placeholder="Simple placeholder" value="newVariable3" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <tri-checkbox triPrefix></tri-checkbox>
          <input size="small" triInput placeholder="Simple placeholder" value="newVariable4" required>
        </tri-form-field>
      </form>
    </div>
  `,
  styleUrls: ['./scope-variable-box.component.scss']
})
export class ScopeVariableBoxComponent {

  filteredStoreItemList$: Observable<StoreItem[]> = this.storeItemUtils.activePageStoreItemList$;
  globalStoreItemList$: Observable<StoreItem[]>   = this.storeItemUtils.globalStoreItemList$;

  constructor(
    private storeItemUtils: StoreItemUtilService
  ) {
  }
}