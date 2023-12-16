import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'ub-step',
  styleUrls: ['./step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <iframe *ngIf="url" [src]="url"></iframe>
    <!--
    Cover is used here to cover iframe and prevent focusing it.
    It's required to make keyboard control user friendly. If we not cover iframe,
    then clicking it will focus it and keyboard control will not work.
    Also, dragging this modal will be painful without cover.
    -->
    <div class="cover"></div>
  `
})
export class StepComponent {
  @Input() url: SafeResourceUrl;
}
