import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { BcInputSearchOption } from './input-search.directive';

@Component({
  selector: 'bc-input-search-result',
  styleUrls: ['./input-search-results.component.scss'],
  template: `
    <ng-container #content></ng-container>
    <div class="option" *ngFor="let option of options; trackBy: trackByFn" (click)="select.emit(option)">
      <nb-icon [pack]="option.iconPack || 'eva'" *ngIf="option.icon" [icon]="option.icon">{{
        option.displayValue
      }}</nb-icon>
      <span>{{ option.displayValue }}</span>
      <nb-icon
        *ngIf="option.endIcon"
        [nbTooltip]="option.endIconTooltip"
        class="end-icon"
        [icon]="option.endIcon"
        [pack]="option.iconPack"
      ></nb-icon>
    </div>
  `
})
export class InputSearchResultsComponent implements AfterViewInit {
  @Input() @HostBinding('style.width.px') hostWidth: number;
  @Input() options: BcInputSearchOption[];

  @Output() select: EventEmitter<BcInputSearchOption> = new EventEmitter<BcInputSearchOption>();
  @ViewChild('content', { read: ViewContainerRef }) host: ViewContainerRef;
  @Input() topItem: TemplateRef<any>;

  trackByFn(index: number, option: BcInputSearchOption) {
    return option.displayValue;
  }

  @HostBinding('class.empty') get empty() {
    if (this.topItem) {
      return false;
    }
    return !this.options || !this.options.length;
  }

  ngAfterViewInit(): void {
    if (this.topItem) {
      this.host.insert(this.topItem.createEmbeddedView(null));
    }
  }
}
