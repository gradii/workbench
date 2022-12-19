import { Injectable } from '@angular/core';

import { GlobalStateService } from '../../workflow/global-state.service';

@Injectable({ providedIn: 'root' })
export class UIDataService {
  constructor(private globalStateService: GlobalStateService) {
  }

  updateUIVariable(componentName: string, outputName: string, value: any) {
    this.globalStateService.updateComponentProperty(componentName, outputName, value);
  }
}
