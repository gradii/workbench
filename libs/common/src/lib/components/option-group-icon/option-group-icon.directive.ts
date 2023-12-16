import {
  Directive,
  Input,
  SimpleChanges,
  ViewContainerRef,
  OnChanges,
  TemplateRef,
  EmbeddedViewRef,
  HostBinding
} from '@angular/core';

@Directive({
  selector: 'nb-option-group[bcOptionGroupIcon]'
})
export class OptionGroupIconDirective<T = any> implements OnChanges {
  private iconRef: EmbeddedViewRef<T>;

  @Input()
  bcOptionGroupIcon: TemplateRef<T>;

  @Input()
  bcOptionGroupIconContext: T;

  @HostBinding('class.option-group-with-icon')
  hasIcon(): boolean {
    return !!this.iconRef;
  }

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!Object.keys(changes).includes('bcOptionGroupIcon')) {
      return;
    }

    const iconChange = changes.bcOptionGroupIcon;
    if (iconChange.currentValue !== iconChange.previousValue) {
      this.updateIcon();
    }
  }

  private updateIcon() {
    if (!this.bcOptionGroupIcon) {
      this.destroyIcon();
    }

    if (!this.iconRef) {
      this.createIconComponent();
    }
  }

  private createIconComponent() {
    const vcrEl: HTMLElement = this.viewContainerRef.element.nativeElement;
    this.iconRef = this.viewContainerRef.createEmbeddedView(this.bcOptionGroupIcon, this.bcOptionGroupIconContext);
    const iconEl = this.iconRef.rootNodes[0];
    vcrEl.insertBefore(iconEl, vcrEl.firstChild);
  }

  private destroyIcon() {
    if (this.iconRef) {
      this.iconRef.destroy();
    }
  }
}
