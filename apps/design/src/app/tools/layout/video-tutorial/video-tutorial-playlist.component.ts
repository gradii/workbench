import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AnalyticsService } from '@common';

import { VIDEO_TUTORIALS, VideoTutorial } from './videos';

@Component({
  selector: 'ub-video-tutorial-playlist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./video-tutorial-playlist.component.scss'],
  templateUrl: './video-tutorial-playlist.component.html'
})
export class VideoTutorialPlaylistComponent {
  videos: VideoTutorial[] = VIDEO_TUTORIALS;

  @Input() selectedVideo: VideoTutorial;
  @Output() select = new EventEmitter<VideoTutorial>();

  constructor(private analytics: AnalyticsService) {
  }

  selectVideo(video: VideoTutorial) {
    this.select.emit(video);
    this.analytics.logVideoTutorialChange(video.title);
  }
}
