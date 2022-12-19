import { Injectable } from '@angular/core';

import { BreakpointWidth, KitchenBreakpointStyles } from '@common/public-api';
import { Action } from '@ngneat/effects/lib/actions.types';
import { FileStorageService, StorageAssetResponse } from '@shared/file-storage.service';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ImageActions } from '@tools-state/image/image.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';

@Injectable({ providedIn: 'root' })
export class ImageUtilService {
  constructor(private fileStorageService: FileStorageService) {
  }

  // Update component model with new `uploadUrl` in according with `definitionId`
  handleImageSourceUpdate(asset: StorageAssetResponse, component: PuffComponent): Action[] {
    // get current bp
    const breakpoint = asset.breakpoint ? asset.breakpoint : BreakpointWidth.Desktop;
    const bpStyles   = component.styles[breakpoint];
    let bpStyleUpdate;

    if (component.definitionId === 'image') {
      bpStyleUpdate = this.getImageStyleUpdate(bpStyles, asset);
    } else if (component.definitionId === 'space' || component.definitionId === 'card') {
      bpStyleUpdate = this.getBgImageStyleUpdate(bpStyles, asset);
    }

    const result = this.generateComponentUpdate(component, breakpoint, bpStyles, bpStyleUpdate);

    return [
      ComponentActions.UpdateComponent(result),
      WorkingAreaActions.SyncState(),
      ProjectActions.UpdateProject(),
      HistoryActions.Persist(),
      ImageActions.UpdateImageSourceSuccess()
    ];
  }

  private getImageStyleUpdate(bpStyles: KitchenBreakpointStyles, asset: StorageAssetResponse): KitchenBreakpointStyles {
    return {
      ...bpStyles,
      src: {
        ...bpStyles.src,
        name     : bpStyles.src?.name || asset.name,
        uploadUrl: this.fileStorageService.generateStorageAssetUrl(asset)
      }
    };
  }

  private getBgImageStyleUpdate(bpStyles: KitchenBreakpointStyles,
                                asset: StorageAssetResponse): KitchenBreakpointStyles {
    return {
      ...bpStyles,
      background: {
        ...bpStyles.background,
        imageSrc: {
          ...bpStyles.background.imageSrc,
          name     : bpStyles.background?.imageSrc?.name || asset.name,
          uploadUrl: this.fileStorageService.generateStorageAssetUrl(asset)
        }
      }
    };
  }

  private generateComponentUpdate(
    component: PuffComponent,
    breakpoint: BreakpointWidth,
    bpStyles: KitchenBreakpointStyles,
    bpStyleUpdate: KitchenBreakpointStyles
  ): Partial<PuffComponent> {
    return {
      id    : component.id,
      styles: {
        ...component.styles,
        [breakpoint]: {
          ...bpStyles[breakpoint],
          ...bpStyleUpdate
        }
      }
    };
  }
}
