import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NbMenuItem } from '@nebular/theme';

import { UserFacade } from '@auth/user-facade.service';

@Component({
  selector: 'ub-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  email$: Observable<string> = this.userFacade.email$;

  menuItems: NbMenuItem[] = [
    {
      title: 'Account',
      link: 'settings',
      icon: 'person'
    },
    {
      title: 'Log Out',
      link: 'auth/logout',
      icon: 'log-out'
    }
  ];

  constructor(private userFacade: UserFacade) {
  }
}
