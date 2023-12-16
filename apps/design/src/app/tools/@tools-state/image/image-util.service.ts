import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { BreakpointWidth, OvenBreakpointStyles } from '@common';
import { FileStorageService, StorageAssetResponse } from '@shared/file-storage.service';
import { ImageActions } from '@tools-state/image/image.actions';
import { BakeryComponent } from '@tools-state/component/component.model';
import { ComponentActions } from '@tools-state/component/component.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { HistoryActions } from '@tools-state/history/history.actions';
import { Update } from '@ngrx/entity';

@Injectable({ providedIn: 'root' })
export class ImageUtilService {
  constructor(private fileStorageService: FileStorageService) {
  }

  // Update component model with new `uploadUrl` in according with `definitionId`
  handleImageSourceUpdate(asset: StorageAssetResponse, component: BakeryComponent): Action[] {
    // get current bp
    const breakpoint = asset.breakpoint ? asset.breakpoint : BreakpointWidth.Desktop;
    const bpStyles = component.styles[breakpoint];
    let bpStyleUpdate;

    if (component.definitionId === 'image') {
      bpStyleUpdate = this.getImageStyleUpdate(bpStyles, asset);
    } else if (component.definitionId === 'space' || component.definitionId === 'card') {
      bpStyleUpdate = this.getBgImageStyleUpdate(bpStyles, asset);
    }

    const result = this.generateComponentUpdate(component, breakpoint, bpStyles, bpStyleUpdate);

    return [
      new ComponentActions.UpdateComponent(result),
      new WorkingAreaActions.SyncState(),
      new ProjectActions.UpdateProject(),
      new HistoryActions.Persist(),
      new ImageActions.UpdateImageSourceSuccess()
    ];
  }

  private getImageStyleUpdate(bpStyles: OvenBreakpointStyles, asset: StorageAssetResponse): OvenBreakpointStyles {
    return {
      ...bpStyles,
      src: {
        ...bpStyles.src,
        name: bpStyles.src?.name || asset.name,
        uploadUrl: this.fileStorageService.generateStorageAssetUrl(asset)
      }
    };
  }

  private getBgImageStyleUpdate(bpStyles: OvenBreakpointStyles, asset: StorageAssetResponse): OvenBreakpointStyles {
    return {
      ...bpStyles,
      background: {
        ...bpStyles.background,
        imageSrc: {
          ...bpStyles.background.imageSrc,
          name: bpStyles.background?.imageSrc?.name || asset.name,
          uploadUrl: this.fileStorageService.generateStorageAssetUrl(asset)
        }
      }
    };
  }

  private generateComponentUpdate(
    component: BakeryComponent,
    breakpoint: BreakpointWidth,
    bpStyles: OvenBreakpointStyles,
    bpStyleUpdate: OvenBreakpointStyles
  ): Update<BakeryComponent> {
    return {
      id: component.id,
      changes: {
        styles: {
          ...component.styles,
          [breakpoint]: {
            ...bpStyles[breakpoint],
            ...bpStyleUpdate
          }
        }
      }
    };
  }
}
