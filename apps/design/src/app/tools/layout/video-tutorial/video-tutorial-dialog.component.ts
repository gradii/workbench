import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { BehaviorSubject } from 'rxjs';

import { INITIAL_TUTORIAL, VIDEO_TUTORIALS, VideoTutorial } from './videos';

@Component({
  selector: 'tutorial-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-tutorial-dialog icon="video" title="Video Tutorials" (close)="close()">
      <ub-video-tutorial-player ubTutorialDialogContent [video]="selectedVideo$ | async"> </ub-video-tutorial-player>

      <ub-video-tutorial-playlist
        ubTutorialDialogPlaylist
        [selectedVideo]="selectedVideo$ | async"
        (select)="selectedVideo$.next($event)"
      >
      </ub-video-tutorial-playlist>
    </ub-tutorial-dialog>
  `
})
export class VideoTutorialDialogComponent {
  @Input() set initialVideoId(id: string) {
    this.openVideo(id);
  }

  selectedVideo$ = new BehaviorSubject<VideoTutorial>(INITIAL_TUTORIAL);

  constructor(private dialogRef: NbDialogRef<VideoTutorialDialogComponent>) {
  }

  close() {
    this.dialogRef.close();
  }

  private openVideo(videoId: string): void {
    if (!videoId) {
      return;
    }
    const video: VideoTutorial = VIDEO_TUTORIALS.find((v: VideoTutorial) => v.id === videoId);
    this.selectedVideo$.next(video);
  }
}
