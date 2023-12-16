import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OvenApp } from '@common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateConverterService } from '@shared/communication/state-converter.service';
import { BakeryApp } from '@tools-state/app/app.model';
import { environment } from '../../environments/environment';

@Injectable()
export class ShareApiService {
  constructor(private http: HttpClient, private stateConverter: StateConverterService) {
  }

  getProject(projectId: string): Observable<OvenApp> {
    return this.http.get(`${environment.apiUrl}/project/share/${projectId}`).pipe(
      map((response: { model: string }) => JSON.parse(response.model)),
      map((app: BakeryApp) => this.stateConverter.convertState(app))
    );
  }
}
