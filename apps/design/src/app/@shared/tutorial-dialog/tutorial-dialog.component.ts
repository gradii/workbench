import { Component, Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({ selector: '[ubTutorialDialogPlaylist]' })
export class TutorialDialogPlaylistDirective {
}

@Directive({ selector: '[ubTutorialDialogContent]' })
export class TutorialDialogContentDirective {
}

@Component({
  selector: 'ub-tutorial-dialog',
  templateUrl: './tutorial-dialog.component.html',
  styleUrls: ['./tutorial-dialog.component.scss']
})
export class TutorialDialogComponent {
  @Input() icon: string;
  @Input() title: string;

  @Output() close = new EventEmitter();
}
