import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KitchenApp } from '@common/public-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments';
import { Hosting, RetryStatuses } from '@root-state/hosting/hosting.model';

@Injectable({ providedIn: 'root' })
export class HostingService {
  constructor(private http: HttpClient) {
  }

  loadHostings(projectId: string): Observable<Hosting[]> {
    return this.http.get<Hosting[]>(`${environment.apiUrl}/hosting/all-by-project/${projectId}`).pipe(
      map(hostings => {
        return hostings.map(hosting => this.prepareHosting(hosting));
      })
    );
  }

  deployHosting(hostingId: number, app: KitchenApp, name: string): Observable<Hosting> {
    return this.http
      .post<Hosting>(`${environment.apiUrl}/hosting/${hostingId}/deploy`, {
        name,
        app: app
      })
      .pipe(map(hosting => this.prepareHosting(hosting)));
  }

  loadHosting(hostingId: number): Observable<Hosting> {
    return this.http
      .get<Hosting>(`${environment.apiUrl}/hosting/${hostingId}`)
      .pipe(map(hosting => this.prepareHosting(hosting)));
  }

  assignDomain(hostingId: number, domain: string) {
    return this.http
      .put<Hosting>(`${environment.apiUrl}/hosting/${hostingId}/assign-domain`, {
        domain
      })
      .pipe(map(hosting => this.prepareHosting(hosting)));
  }

  deleteDomain(hostingId: number) {
    return this.http
      .delete<Hosting>(`${environment.apiUrl}/hosting/${hostingId}/assign-domain`)
      .pipe(map(hosting => this.prepareHosting(hosting)));
  }

  private prepareHosting(hosting: Hosting): Hosting {
    const statuses = (h: Hosting) => {
      const published = h.website && h.website.published;
      const latest = h.website && h.website.latest;

      return {
        publishedDeploymentDate: (published && published.updatedAt) || null,
        publishedDeploymentStatus: (published && published.status) || null,
        currentDeploymentStatus: (latest && latest.status) || null,
        currentShouldRetry: this.shouldRetry(h)
      };
    };

    return {
      ...hosting,
      ...statuses(hosting)
    };
  }

  private shouldRetry(hosting: Hosting): boolean {
    const latest = hosting.website && hosting.website.latest;
    if (latest) {
      return RetryStatuses.includes(latest.status);
    }
    return false;
  }
}
