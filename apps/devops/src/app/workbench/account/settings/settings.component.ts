import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProfileFacade } from '@account-state/profile/profile.facade';

@Component({
  selector: 'len-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  tabs = [
    {
      title: 'profile',
      route: '/settings/profile'
    },
    {
      title: 'billing',
      route: '/settings/billing'
    }
  ];

  constructor(private profileFacade: ProfileFacade) {
    this.profileFacade.load();
  }
}
