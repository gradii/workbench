import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { DomSanitizer } from '@angular/platform-browser';

import { VideoTutorialDialogComponent } from './video-tutorial-dialog.component';
import { VideoTutorial } from './videos';

@Component({
  selector: 'ub-video-tutorial-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./video-tutorial-player.component.scss'],
  templateUrl: './video-tutorial-player.component.html'
})
export class VideoTutorialPlayerComponent {
  @Input() video: VideoTutorial;

  constructor(private dialogRef: NbDialogRef<VideoTutorialDialogComponent>, private sanitizer: DomSanitizer) {
  }

  get currentVideoURL() {
    const url = `https://www.youtube.com/embed/${this.video.id}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
