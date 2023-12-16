import { NbDialogRef, NbOverlayRef } from '@nebular/theme';

import { DialogComponent } from './dialog.component';

export class DialogRef<T> extends NbDialogRef<T> {
  constructor(overlayRef: NbOverlayRef, private container: DialogComponent) {
    super(overlayRef);

    this.container.closeAnimationDone$.subscribe(res => super.close(res));
  }

  close(res?) {
    this.container.animateClose(res);
    super.close(res);
  }
}
