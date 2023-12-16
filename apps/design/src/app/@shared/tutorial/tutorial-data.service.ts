import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Tutorial, TutorialBrief } from '@tools-state/tutorial-brief/tutorial-brief.model';

export interface TutorialProgress {
  id: string;
  tutorialId: string;
  projectId: string;
  lesson: number;
  step: number;
  completed: boolean;
}

export interface UpdateTutorialProgress {
  lesson: number;
  step: number;
  complete: boolean;
}

@Injectable()
export class TutorialDataService {
  constructor(private http: HttpClient) {
  }

  initialize(tutorialId: string): Observable<TutorialProgress> {
    return this.http.post<TutorialProgress>(`${environment.apiUrl}/tutorial/progress`, { tutorialId });
  }

  getTutorial(tutorialId: string): Observable<Tutorial> {
    return this.http.get<Tutorial>(`${environment.apiUrl}/tutorial/${tutorialId}`);
  }

  getTutorials(): Observable<TutorialBrief[]> {
    return this.http.get<TutorialBrief[]>(`${environment.apiUrl}/tutorial`);
  }

  updateTutorialProgress(viewId: string, updateTutorialProgress: UpdateTutorialProgress): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/tutorial/progress/${viewId}`, updateTutorialProgress);
  }

  getTutorialProgress(viewId: string): Observable<TutorialProgress> {
    return this.http.get<TutorialProgress>(`${environment.apiUrl}/tutorial/progress/${viewId}`);
  }
}
