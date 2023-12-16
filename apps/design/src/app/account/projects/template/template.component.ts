import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { Template } from '@account-state/template/template.model';

@Component({
  selector: 'ub-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./template.component.scss'],
  templateUrl: './template.component.html'
})
export class TemplateComponent {
  @Input() template: Template;
  @Input() loading: boolean;
  @Input() downloadState = false;
  @Input() disableCreation = false;
  @Output() create: EventEmitter<void> = new EventEmitter<void>();
  @Output() download: EventEmitter<void> = new EventEmitter<void>();
  @Output() upgrade: EventEmitter<void> = new EventEmitter<void>();
}
