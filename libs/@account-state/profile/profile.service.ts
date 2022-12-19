import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '@account-state/profile/profile.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { UserService } from '@auth/user.service';
import { UpdateUserRequest } from '@auth/user.model';
import { environment } from '@environments';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient, private userService: UserService) {
  }

  get(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiUrl}/user`);
  }

  update(profile: Profile): Observable<Profile> {
    const updateReq: UpdateUserRequest = this.createUpdateRequest(profile);
    return this.userService.update(updateReq).pipe(map(() => profile));
  }

  private createUpdateRequest(profile: Profile): UpdateUserRequest {
    return {
      fullName: profile.name,
      company: profile.company,
      role: profile.role,
      email: profile.email
    };
  }
}
