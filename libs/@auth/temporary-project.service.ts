import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TriNotificationService } from '@gradii/triangle/notification';

const LOCAL_STORAGE_TOKEN = 'temporaryProjectToken';
const LOCAL_STORAGE_TEMPLATE_TOKEN = 'templateViewIdToOpen';

@Injectable({ providedIn: 'root' })
export class TemporaryProjectService {
  constructor(private router: Router, private toastrService: TriNotificationService) {
  }

  public viewIdToOpen: string;
  public temporaryRejectMessage: string;

  getTemplateViewIdToOpen(): string {
    return sessionStorage.getItem(LOCAL_STORAGE_TEMPLATE_TOKEN);
  }

  setTemplateViewIdToOpen(token: string) {
    if (token) {
      sessionStorage.setItem(LOCAL_STORAGE_TEMPLATE_TOKEN, token);
    }
  }

  dropTemplateViewIdToOpen() {
    sessionStorage.removeItem(LOCAL_STORAGE_TEMPLATE_TOKEN);
  }

  getTemporaryProjectToken(): string {
    return sessionStorage.getItem(LOCAL_STORAGE_TOKEN);
  }

  setTemporaryProjectToken(token: string) {
    if (token) {
      sessionStorage.setItem(LOCAL_STORAGE_TOKEN, token);
    }
  }

  dropTemporaryToken() {
    sessionStorage.removeItem(LOCAL_STORAGE_TOKEN);
  }

  public naviagateToProject() {
    this.router.navigate(['/tools', this.viewIdToOpen, 'builder']);
  }

  public showProjectCreationErrorIfNeed() {
    if (this.temporaryRejectMessage) {
      this.toastrService.error(this.temporaryRejectMessage, 'Project creation error', {
        duration: 3500,
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
