import { Inject, Injectable } from '@angular/core';
import { NB_WINDOW, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

const LOCAL_STORAGE_TOKEN = 'temporaryProjectToken';
const LOCAL_STORAGE_TEMPLATE_TOKEN = 'templateViewIdToOpen';

@Injectable({ providedIn: 'root' })
export class TemporaryProjectService {
  constructor(@Inject(NB_WINDOW) private window, private router: Router, private toastrService: NbToastrService) {
  }

  public viewIdToOpen: string;
  public temporaryRejectMessage: string;

  getTemplateViewIdToOpen(): string {
    return this.window.sessionStorage.getItem(LOCAL_STORAGE_TEMPLATE_TOKEN);
  }

  setTemplateViewIdToOpen(token: string) {
    if (token) {
      this.window.sessionStorage.setItem(LOCAL_STORAGE_TEMPLATE_TOKEN, token);
    }
  }

  dropTemplateViewIdToOpen() {
    this.window.sessionStorage.removeItem(LOCAL_STORAGE_TEMPLATE_TOKEN);
  }

  getTemporaryProjectToken(): string {
    return this.window.sessionStorage.getItem(LOCAL_STORAGE_TOKEN);
  }

  setTemporaryProjectToken(token: string) {
    if (token) {
      this.window.sessionStorage.setItem(LOCAL_STORAGE_TOKEN, token);
    }
  }

  dropTemporaryToken() {
    this.window.sessionStorage.removeItem(LOCAL_STORAGE_TOKEN);
  }

  public naviagateToProject() {
    this.router.navigate(['/tools', this.viewIdToOpen, 'builder']);
  }

  public showProjectCreationErrorIfNeed() {
    if (this.temporaryRejectMessage) {
      this.toastrService.danger(this.temporaryRejectMessage, 'Project creation error', {
        duration: 3500,
        destroyByClick: true
      });
      this.temporaryRejectMessage = '';
    }
  }

  public setViewIdToOpen(responseBody: any) {
    if (responseBody) {
      if (responseBody.temporaryRejectMessage) {
        console.error(responseBody.temporaryRejectMessage);
        this.temporaryRejectMessage = responseBody.temporaryRejectMessage;
      } else {
        this.viewIdToOpen = responseBody.viewId;
      }
    }
  }
}
