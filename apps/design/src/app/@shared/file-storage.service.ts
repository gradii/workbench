import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BreakpointWidth } from '@common';
import { environment } from '../../environments/environment';

export interface StorageAssetCopyRequest {
  url: string;
  name: string;
  componentId: string;
  breakpoint: BreakpointWidth;
}

export interface StorageAssetResponse {
  blobId: string;
  storageProjectId: string;
  assetType: 'image';
  name: string;
  componentId?: string;
  breakpoint?: BreakpointWidth;
}

@Injectable({ providedIn: 'root' })
export class FileStorageService {
  public static ASSETS_STORAGE_PATH = 'assets';
  public static IMAGE_ASSETS_TYPE = 'image';

  constructor(private http: HttpClient) {
  }

  uploadFile(formData: FormData) {
    return this.http.post<StorageAssetResponse>(`${environment.apiUrl}/storage/upload`, formData);
  }

  copyAssets(assets: StorageAssetCopyRequest[], viewId: string) {
    return this.http.post<StorageAssetResponse[]>(`${environment.apiUrl}/storage/copy`, { assets, viewId });
  }

  generateStorageAssetUrl(asset: StorageAssetResponse): string {
    const typeFolderPath = 'images';

    if (asset.assetType !== FileStorageService.IMAGE_ASSETS_TYPE) {
      return null;
    }

    return (
      `${environment.azureAssetsContainerPrefix}${FileStorageService.ASSETS_STORAGE_PATH}/` +
      `${asset.storageProjectId}/${typeFolderPath}/${asset.blobId}`
    );
  }
}
